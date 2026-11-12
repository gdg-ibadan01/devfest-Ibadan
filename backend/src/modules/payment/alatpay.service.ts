import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import * as crypto from 'node:crypto';
import alatpayConfig from 'src/config/alatpay.config';
import { ServiceError } from 'src/common/errors/service-error';
import {
  CheckoutParams,
  CheckoutSession,
  GatewayRequestError,
  NormalizedTransaction,
  PaymentProvider,
  RefundPaymentParams,
  RefundPaymentResult,
} from './interfaces/payment-provider.interface';
import {
  getCI,
  normalizeAlatpayTransaction,
  splitFullName,
  unwrapList,
} from './alatpay.mapper';

const REQUEST_TIMEOUT_MS = 15_000;

@Injectable()
export class AlatpayService implements PaymentProvider {
  readonly name = 'ALATPAY' as const;

  static ERRORS = {
    ConfigErr: 'AlatpayConfigErr',
  } satisfies Record<string, `${string}Err`>;

  private readonly logger = new Logger(AlatpayService.name);

  constructor(
    @Inject(alatpayConfig.KEY)
    private readonly cfg: ConfigType<typeof alatpayConfig>,
  ) {
    if (cfg.publicKey && !cfg.secretKey) {
      this.logger.warn(
        'ALATPAY_SECRET_KEY is not set: card payments can only be confirmed by webhook (verify and reconciliation need it).',
      );
    }
  }

  get orderTtlMinutes(): number {
    return this.cfg.orderTtlMinutes;
  }

  get reconciliationEnabled(): boolean {
    return this.cfg.reconciliationEnabled;
  }

  isConfigured(): boolean {
    return Boolean(
      this.cfg.publicKey &&
      this.cfg.businessId &&
      this.cfg.webhookSecret &&
      this.cfg.orderTokenSecret,
    );
  }

  /**
   * Optional IP allowlist for callbacks. True when no allowlist is set.
   * Signature verification is still required either way.
   */
  isAllowedWebhookIp(ip: string | undefined): boolean {
    const allowlist = this.cfg.webhookIpAllowlist ?? [];
    if (allowlist.length === 0) return true;
    if (!ip) return false;
    return allowlist.includes(ip.replace(/^::ffff:/, ''));
  }

  createCheckout(params: CheckoutParams): Promise<CheckoutSession> {
    this.assertConfigured();
    const { firstName, lastName } = splitFullName(params.customer.fullName);

    const session: CheckoutSession = {
      provider: this.name,
      mode: 'INLINE',
      reference: params.reference,
      amount: params.amount,
      currency: 'NGN',
      config: {
        scriptUrl: this.cfg.scriptUrl,
        apiKey: this.cfg.publicKey,
        businessId: this.cfg.businessId,
        email: params.customer.email,
        firstName,
        lastName,
        amount: params.amount,
        currency: 'NGN',
        // ALATPay echoes this back (as a JSON string) on the transaction,
        // which is how callbacks and requeries are tied to our order.
        metadata: {
          orderId: params.orderId,
          reference: params.reference,
          orderToken: this.signOrderToken(params.orderId, params.reference),
        },
      },
    };
    return Promise.resolve(session);
  }

  /** Binds a transaction to one order so metadata cannot be replayed onto another. */
  signOrderToken(orderId: string, reference: string): string {
    return crypto
      .createHmac('sha256', this.requireConfig('orderTokenSecret'))
      .update(`${orderId}:${reference}`)
      .digest('hex')
      .slice(0, 32);
  }

  isValidOrderToken(
    orderId: string,
    reference: string,
    token: string | null | undefined,
  ): boolean {
    if (!token) return false;
    const expected = Buffer.from(this.signOrderToken(orderId, reference));
    const received = Buffer.from(token);
    return (
      expected.length === received.length &&
      crypto.timingSafeEqual(expected, received)
    );
  }

  /** `x-signature` = Base64(HMAC-SHA256(rawBody, webhookSecret)). */
  verifyWebhookSignature(
    rawBody: Buffer | undefined,
    signature?: string,
  ): boolean {
    if (!rawBody || !signature || !this.cfg.webhookSecret) return false;
    const expected = crypto
      .createHmac('sha256', this.cfg.webhookSecret)
      .update(rawBody)
      .digest();
    const cleaned = signature.trim().replace(/^sha256=/i, '');
    const received = Buffer.from(cleaned, 'base64');
    return (
      received.length === expected.length &&
      crypto.timingSafeEqual(received, expected)
    );
  }

  async getTransaction(transactionId: string): Promise<NormalizedTransaction> {
    this.assertConfigured();
    const url = `${this.cfg.transactionsBaseUrl}/${encodeURIComponent(transactionId)}`;
    const res = await this.get(url);

    if (getCI(res.data, ['status']) === false) {
      const message = String(getCI(res.data, ['message']) ?? 'not found');
      throw new GatewayRequestError(
        `ALATPay requery rejected ${transactionId}: ${message}`,
        false,
        404,
      );
    }

    const tx = normalizeAlatpayTransaction(res.data);
    if (!tx.transactionRef) tx.transactionRef = transactionId;
    return tx;
  }

  /** Completed transactions in a time window (used by reconciliation). */
  async listTransactions(
    startAt: Date,
    endAt: Date,
  ): Promise<NormalizedTransaction[]> {
    this.assertConfigured();
    const query = new URLSearchParams({
      businessId: this.requireConfig('businessId'),
      status: 'completed',
      page: '1',
      limit: '100',
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    });
    const res = await this.get(
      `${this.cfg.transactionsBaseUrl}?${query.toString()}`,
    );
    const rows = unwrapList(res.data);
    const data = getCI(res.data, ['data']);
    if (
      rows.length === 0 &&
      data &&
      typeof data === 'object' &&
      !Array.isArray(data)
    ) {
      // The docs sample shows `data` as a single object. If the live API does
      // the same, reconciliation silently finds nothing, so make it visible.
      this.logger.warn(
        'ALATPay transactions list returned an object, not an array; nothing reconciled',
      );
    }
    return rows
      .map((row) => normalizeAlatpayTransaction(row))
      .filter((tx) => tx.transactionRef);
  }

  /**
   * Admin diagnostics: recent transactions exactly as ALATPay returns them
   * (envelope shape + each transaction normalized), to answer "I paid but my
   * order isn't confirmed" without dashboard access.
   */
  async inspectTransactions(since: Date | null) {
    this.assertConfigured();
    const query = new URLSearchParams({
      businessId: this.requireConfig('businessId'),
      page: '1',
      limit: '50',
      ...(since && {
        startAt: since.toISOString(),
        endAt: new Date().toISOString(),
      }),
    });
    const res = await this.get(
      `${this.cfg.transactionsBaseUrl}?${query.toString()}`,
    );
    const body = res.data;
    const rows = unwrapList(body);
    const data = getCI(body, ['data']);
    return {
      host: new URL(this.cfg.transactionsBaseUrl).host,
      envelopeKeys:
        body && typeof body === 'object' ? Object.keys(body as object) : [],
      message: getCI(body, ['message']) ?? null,
      dataShape: Array.isArray(data)
        ? `array(${data.length})`
        : data && typeof data === 'object'
          ? `object{${Object.keys(data).join(',')}}`
          : String(data),
      count: rows.length,
      transactions: rows.map((row) => {
        const tx = normalizeAlatpayTransaction(row);
        return {
          transactionRef: tx.transactionRef,
          status: tx.status,
          gatewayStatus: getCI(tx.raw, ['status']),
          amount: tx.amount,
          orderId: tx.orderId,
          reference: tx.reference,
          channel: getCI(tx.raw, ['channel']),
          createdAt: getCI(tx.raw, ['createdAt']),
          metadata: getCI(tx.raw, ['customer', 'metadata']) ?? null,
        };
      }),
    };
  }

  /**
   * The completed transaction for one of our orders, found by the orderId in
   * its metadata. Card payments: the popup reports success without an id.
   */
  async findCompletedTransactionRef(
    orderId: string,
    since: Date,
  ): Promise<string | null> {
    const transactions = await this.listTransactions(since, new Date());
    const match = transactions.find(
      (tx) => tx.orderId === orderId && tx.status === 'COMPLETED',
    );
    return match?.transactionRef ?? null;
  }

  /** ALATPay publishes no refund API: refunds are done by hand from the dashboard. */
  requestRefund(params: RefundPaymentParams): Promise<RefundPaymentResult> {
    this.logger.error(
      `MANUAL_REFUND_REQUIRED: refund ${params.refundReference} of NGN ${params.amount} for ALATPay transaction ${params.transactionReference} (${params.reason})`,
    );
    const result: RefundPaymentResult = {
      success: false,
      manual: true,
      message:
        'ALATPay refunds are processed manually from the ALATPay dashboard',
    };
    return Promise.resolve(result);
  }

  /**
   * GET with `Ocp-Apim-Subscription-Key`. The transaction API wants the secret
   * key (the public key gets a 401); the public key is tried only as a fallback.
   */
  private async get(url: string): Promise<AxiosResponse<unknown>> {
    const keys = [this.cfg.secretKey, this.cfg.publicKey].filter(
      (key, index, all): key is string => !!key && all.indexOf(key) === index,
    );

    let lastStatus: number | undefined;
    for (const key of keys) {
      let res: AxiosResponse<unknown>;
      try {
        res = await axios.get<unknown>(url, {
          timeout: REQUEST_TIMEOUT_MS,
          headers: {
            Accept: 'application/json',
            'Ocp-Apim-Subscription-Key': key,
          },
          validateStatus: () => true,
        });
      } catch (err) {
        throw new GatewayRequestError(
          `ALATPay is unreachable: ${(err as Error).message}`,
          true,
        );
      }

      if (res.status === 401 || res.status === 403) {
        lastStatus = res.status;
        continue;
      }
      if (res.status >= 500 || res.status === 429) {
        throw new GatewayRequestError(
          `ALATPay returned HTTP ${res.status}`,
          true,
          res.status,
        );
      }
      if (res.status < 200 || res.status >= 300) {
        throw new GatewayRequestError(
          `ALATPay returned HTTP ${res.status}`,
          false,
          res.status,
        );
      }
      return res;
    }

    throw new GatewayRequestError(
      `ALATPay rejected our credentials (HTTP ${lastStatus}). Check ALATPAY_SECRET_KEY.`,
      false,
      lastStatus,
    );
  }

  private assertConfigured(): void {
    if (!this.isConfigured()) {
      throw new ServiceError(
        'ALATPay is not configured. Set ALATPAY_PUBLIC_KEY, ALATPAY_BUSINESS_ID and ALATPAY_WEBHOOK_SECRET.',
        AlatpayService.ERRORS.ConfigErr,
      );
    }
  }

  private requireConfig(key: 'businessId' | 'orderTokenSecret'): string {
    const value = this.cfg[key];
    if (!value) {
      throw new ServiceError(
        `ALATPay ${key} is not configured`,
        AlatpayService.ERRORS.ConfigErr,
      );
    }
    return value;
  }
}
