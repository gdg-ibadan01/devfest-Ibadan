import { Injectable, Logger } from '@nestjs/common';
import { OrderStatus, Prisma, type Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';
import { ServiceError } from 'src/common/errors/service-error';
import { PaymentProviderRegistry } from '../payment/payment-provider.registry';
import { AlatpayService } from '../payment/alatpay.service';
import { normalizeAlatpayTransaction } from '../payment/alatpay.mapper';
import {
  GatewayRequestError,
  NormalizedTransaction,
  PaymentProviderName,
} from '../payment/interfaces/payment-provider.interface';
import { OrdersService } from '../order/order.service';

export type ConfirmSource = 'WEBHOOK' | 'CLIENT' | 'ADMIN' | 'SWEEPER';

export type ConfirmOutcome =
  'PROCESSED' | 'DUPLICATE' | 'NOT_COMPLETED' | 'REJECTED' | 'IGNORED';

export interface ConfirmResult {
  outcome: ConfirmOutcome;
  reason?: string;
  gatewayStatus?: string;
  orderId?: string;
}

interface ConfirmParams {
  provider: PaymentProviderName;
  transactionRef: string;
  source: ConfirmSource;
  /** When set, the transaction must belong to this order reference. */
  expectedReference?: string;
  /**
   * The provider's own signature-verified webhook payload. Used only if the
   * requery still fails after in-process retries. ALATPay's first webhook
   * retry is 30 minutes later, so a genuine signed payment is confirmed now
   * rather than leaving the customer waiting for their ticket.
   */
  signedFallback?: NormalizedTransaction;
}

/** In-process requery retries for transient gateway errors. */
const REQUERY_BACKOFF_MS = [1_000, 3_000];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Clock skew allowance when searching gateway transactions for an order. */
const LOOKUP_SLACK_MS = 5 * 60_000;

/**
 * The single path that turns a provider transaction into a PAID order.
 * Webhooks, the browser's post-popup verify call, admin requery and the
 * reconciliation job all come through here. The provider is always
 * re-queried (source of truth), and the result is deduplicated by
 * transaction before OrdersService.handlePaymentSuccess runs.
 */
@Injectable()
export class PaymentConfirmationService {
  static ERRORS = {
    OrderNotFoundErr: 'OrderNotFoundErr',
  } satisfies Record<string, `${string}Err`>;

  private readonly logger = new Logger(PaymentConfirmationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly payments: PaymentProviderRegistry,
    private readonly alatpay: AlatpayService,
    private readonly orders: OrdersService,
  ) {}

  /** Signed ALATPay callback (signature already verified by the controller). */
  async handleAlatpayCallback(body: unknown): Promise<ConfirmResult> {
    const claimed = normalizeAlatpayTransaction(body);
    if (!claimed.transactionRef) {
      this.logger.warn('ALATPay callback without a transaction id; ignoring');
      return { outcome: 'IGNORED', reason: 'missing transaction id' };
    }
    if (claimed.status !== 'COMPLETED') {
      this.logger.log(
        `ALATPay callback for ${claimed.transactionRef} is ${claimed.status}; nothing to do`,
      );
      return { outcome: 'NOT_COMPLETED', gatewayStatus: claimed.status };
    }

    return this.confirm({
      provider: 'ALATPAY',
      transactionRef: claimed.transactionRef,
      source: 'WEBHOOK',
      signedFallback: claimed,
    });
  }

  /**
   * Browser reports a completed popup payment. Never trusted without a
   * requery. Without a transaction id (ALATPay card payments), the order's
   * completed transaction is looked up on the gateway by its metadata.
   */
  async verifyFromClient(
    reference: string,
    transactionRef: string | undefined,
    source: ConfirmSource = 'CLIENT',
  ): Promise<{
    status: OrderStatus;
    outcome: ConfirmOutcome | 'ALREADY_FINAL';
  }> {
    const order = await this.prisma.order.findFirst({
      where: { reference },
      select: {
        id: true,
        status: true,
        paymentProvider: true,
        createdAt: true,
      },
    });
    if (!order) {
      throw new ServiceError(
        'Order not found',
        PaymentConfirmationService.ERRORS.OrderNotFoundErr,
      );
    }
    if (order.status !== OrderStatus.AWAITING_PAYMENT) {
      return { status: order.status, outcome: 'ALREADY_FINAL' };
    }

    const provider = this.payments.for(order.paymentProvider).name;
    const ref =
      transactionRef ??
      (provider === 'ALATPAY'
        ? await this.alatpay.findCompletedTransactionRef(
            order.id,
            new Date(order.createdAt.getTime() - LOOKUP_SLACK_MS),
          )
        : null);
    if (!ref) {
      // Nothing completed on the gateway yet; the webhook or reconciliation
      // will confirm it once it is.
      return { status: order.status, outcome: 'NOT_COMPLETED' };
    }

    const result = await this.confirm({
      provider,
      transactionRef: ref,
      source,
      expectedReference: reference,
    });

    const fresh = await this.prisma.order.findUnique({
      where: { id: order.id },
      select: { status: true },
    });
    return { status: fresh?.status ?? order.status, outcome: result.outcome };
  }

  async confirm(params: ConfirmParams): Promise<ConfirmResult> {
    const provider = this.payments.for(params.provider);
    const label = `${provider.name} tx ${params.transactionRef} (${params.source})`;

    let tx: NormalizedTransaction;
    try {
      tx = await this.requery(params.transactionRef, params.provider);
    } catch (err) {
      if (params.signedFallback) {
        this.logger.warn(
          `${label}: requery failed (${(err as Error).message}); using the signature-verified callback payload`,
        );
        tx = params.signedFallback;
      } else {
        throw err;
      }
    }

    if (tx.status !== 'COMPLETED') {
      return { outcome: 'NOT_COMPLETED', gatewayStatus: tx.status };
    }

    let order: Order | null = null;
    if (tx.orderId) {
      order = await this.prisma.order.findUnique({ where: { id: tx.orderId } });
    } else if (tx.reference) {
      order = await this.prisma.order.findFirst({
        where: { reference: tx.reference },
      });
    }

    const reject = (reason: string): ConfirmResult => {
      this.logger.warn(`${label} rejected: ${reason}`);
      return { outcome: 'REJECTED', reason, orderId: order?.id };
    };

    if (!order) return reject('no matching order');
    if (
      params.expectedReference &&
      order.reference !== params.expectedReference
    ) {
      return reject(
        `belongs to ${order.reference}, not ${params.expectedReference}`,
      );
    }
    if (tx.reference && tx.reference !== order.reference) {
      return reject(
        `reference ${tx.reference} does not match order ${order.reference}`,
      );
    }
    if (order.paymentProvider !== provider.name) {
      return reject(`order was created on ${order.paymentProvider}`);
    }
    if (
      provider.name === 'ALATPAY' &&
      !this.alatpay.isValidOrderToken(order.id, order.reference, tx.orderToken)
    ) {
      return reject('order token missing or invalid');
    }
    if (tx.currency && tx.currency !== order.currency) {
      return reject(`currency ${tx.currency} != ${order.currency}`);
    }

    const event = await this.recordEvent({
      provider: provider.name,
      transactionReference: tx.transactionRef,
      paymentReference: order.reference,
      payload: tx.raw,
    });
    if (!event) {
      throw new GatewayRequestError(`${label}: could not record event`, true);
    }
    if (event.processed) {
      return { outcome: 'DUPLICATE', orderId: order.id };
    }

    // Amount, capacity, expiry and group checks (and refunds) live here.
    await this.orders.handlePaymentSuccess({
      webhookEventId: event.id,
      provider: provider.name,
      transactionReference: tx.transactionRef,
      paymentReference: order.reference,
      amountPaid: tx.amount,
      currency: tx.currency || order.currency,
      metaData: { orderId: order.id },
      paidOn: tx.paidAt ?? new Date().toISOString(),
      paymentStatus: tx.status,
      paymentDescription: tx.description ?? '',
    });

    this.logger.log(`${label} processed for order ${order.id}`);
    return { outcome: 'PROCESSED', orderId: order.id };
  }

  /** Requery with short backoff on transient errors (timeouts, 5xx, 429). */
  private async requery(
    transactionRef: string,
    providerName: PaymentProviderName,
  ): Promise<NormalizedTransaction> {
    const provider = this.payments.for(providerName);
    for (let attempt = 0; ; attempt++) {
      try {
        return await provider.getTransaction(transactionRef);
      } catch (err) {
        const retryable = err instanceof GatewayRequestError && err.retryable;
        if (!retryable || attempt >= REQUERY_BACKOFF_MS.length) throw err;
        await sleep(REQUERY_BACKOFF_MS[attempt]);
      }
    }
  }

  /** Idempotent insert keyed on (provider, eventType, transactionReference). */
  private async recordEvent(ev: {
    provider: PaymentProviderName;
    transactionReference: string;
    paymentReference: string;
    payload: unknown;
  }) {
    const eventType = 'TRANSACTION_COMPLETED';
    try {
      return await this.prisma.webhookEvent.create({
        data: {
          provider: ev.provider,
          eventType,
          paymentReference: ev.paymentReference,
          transactionReference: ev.transactionReference,
          payload: (ev.payload ?? {}) as Prisma.InputJsonValue,
          processed: false,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === PrismaErrors.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return this.prisma.webhookEvent.findFirst({
          where: {
            provider: ev.provider,
            eventType,
            transactionReference: ev.transactionReference,
          },
        });
      }
      throw err;
    }
  }
}
