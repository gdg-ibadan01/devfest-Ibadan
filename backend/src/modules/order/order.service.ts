import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma, RefundStatus, type Order } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from 'src/common/errors/service-error';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';
import {
  InitializePaymentParams,
  PAYMENT_PROVIDER,
  PaymentProvider,
} from '../payment/interfaces/payment-provider.interface';
import { MonnifyRejectedPaymentWebhookEventData } from '../payment/interfaces/monnify.interface';
import {
  CreateOrderDto,
  CreateOrderResponseDto,
  OrdersQueryDto,
} from './create-order.dto';
import { PDFService } from '../pdf/pdf.service';
import { UploadService } from '../upload/upload.service';
import crypto from 'node:crypto';
import AppConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

const ORDER_TTL_MINUTES = 30;
const TX_MAX_ATTEMPTS = 3;
const CANCEL_MAX_ATTEMPTS = 3;

type TxClient = Prisma.TransactionClient;

interface CreatedOrderRecord {
  order: Order;
  ticketName: string;
  ticketSlug: string;
  createdById?: string | null;
}

interface CreateRefundRecord {
  transactionReference: string;
  paymentReference: string;
}

interface PaymentSuccessPayload {
  webhookEventId: string;
  transactionReference: string;
  paymentReference: string;
  paidOn: string;
  paymentDescription: string;
  metaData: { orderId: string };
  amountPaid: number;
  currency: string;
  paymentStatus: string;
  provider: 'MONNIFY';
}

interface ProcessRefundPayload {
  refundId: string;
  orderId: string;
  provider: PaymentSuccessPayload['provider'];
}

interface OrderQueryRawResult {
  id: string;
  reference: string;
  ticket_id: string;
  attendee_full_name: string;
  attendee_email: string;
  attendee_phone_number: null | string;
  gifter_name: null | string;
  gifter_email: null | string;
  discount: number;
  amount: number;
  currency: string;
  status: string;
  payment_provider: string;
  provider_transaction_ref: string;
  checkout_url: string;
  expires_at: Date;
  paid_at: any;
  created_at: Date;
  updated_at: Date;
}

interface TicketQueryRawResult {
  id: string;
  capacity: number;
  price: Prisma.Decimal;
  discount: Prisma.Decimal;
  sale_starts_at: Date;
  sale_ends_at: Date;
  validity_dates: Date[];
  name: string;
  slug: string;
}

@Injectable()
export class OrdersService {
  static ERRORS = {
    ValidationErr: 'ValidationErr',
    NotOnSaleErr: 'NotOnSaleErr',
    SoldOutErr: 'SoldOutErr',
    RetryLaterErr: 'RetryLaterErr',
    DuplicateErr: 'DuplicateErr',
    PaymentErr: 'PaymentErr',
    TicketNotFoundErr: 'TicketNotFoundErr',
    OrderNotFoundErr: 'OrderNotFoundErr',
  } as const;

  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
    private readonly pdfService: PDFService,
    private readonly uploadService: UploadService,
    @Inject(AppConfig.KEY)
    private appConfig: ConfigType<typeof AppConfig>,
  ) {}

  async create(
    payload: CreateOrderDto,
    options?: {
      createdById?: string | null;
      skipSaleWindowCheck?: boolean;
    },
  ): Promise<CreateOrderResponseDto> {
    const attendeeEmail = payload.attendee.email.trim().toLowerCase();
    const gifterEmail = payload.gifter?.email.trim().toLowerCase();
    const createdById = options?.createdById ?? payload.createdById ?? null;
    const skipSaleWindowCheck =
      options?.skipSaleWindowCheck ?? payload.skipSaleWindowCheck ?? false;

    let record!: CreatedOrderRecord;
    for (let attempt = 1; attempt <= TX_MAX_ATTEMPTS; attempt++) {
      try {
        record = await this.prisma.$transaction(
          (tx) =>
            this.createOrderRecord(tx, {
              slug: payload.slug,
              attendeeFullName: payload.attendee.fullName.trim(),
              attendeeEmail,
              attendeePhoneNumber: payload.attendee.phoneNumber?.trim() || null,
              gifterName: payload.gifter?.fullName.trim() ?? null,
              gifterEmail: gifterEmail ?? null,
              createdById: createdById ?? null,
              skipSaleWindowCheck,
            }),
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        break;
      } catch (err) {
        const isRetryable =
          (err as { code?: string }).code === 'P2034' ||
          (err as { code?: string }).code ===
            PrismaErrors.UNIQUE_CONSTRAINT_VIOLATION;
        if (isRetryable && attempt < TX_MAX_ATTEMPTS) continue;
        if (err instanceof ServiceError || err instanceof NotFoundException) {
          throw err;
        }
        this.logger.error(err);
        throw new ServiceError(
          'Unable to create order. Retry in about 10 minutes',
          OrdersService.ERRORS.RetryLaterErr,
        );
      }
    }
    if (createdById) {
      this.prisma.auditLog
        .create({
          data: {
            adminId: createdById,
            action: 'CREATE_ATTENDEE',
            metadata: {
              orderId: record.order.id,
              reference: record.order.reference,
              attendeeFullName: record.order.attendeeFullName,
              attendeeEmail: record.order.attendeeEmail,
              attendeePhoneNumber: record.order.attendeePhoneNumber,
              gifterName: record.order.gifterName,
              gifterEmail: record.order.gifterEmail,
              ticketSlug: record.ticketSlug,
              ticketName: record.ticketName,
              amount: record.order.amount.toFixed(2),
            },
          },
        })
        .catch((err: Error) =>
          this.logger.error(
            `Failed to write audit log for order ${record.order.id}: ${err.message}`,
          ),
        );
    }

    const payer = {
      fullName:
        payload.gifter?.fullName.trim() ?? payload.attendee.fullName.trim(),
      email: gifterEmail ?? attendeeEmail,
    };

    const response = await this.initializeCheckout(record, payer);

    this.logger.log(
      `Email check => createdById: ${createdById}, checkoutUrl: ${response.checkoutUrl ? 'present' : 'missing'}, payer: ${payer.email}`,
    );

    if (createdById && response.checkoutUrl) {
      try {
        this.logger.log(
          `Sending payment link email to ${payer.email} for order ${response.id}`,
        );

        await this.mailService.sendPaymentLinkEmail(
          payer.email,
          payer.fullName,
          response.checkoutUrl,
          Number(response.amount),
        );

        this.logger.log(
          `Payment link email successfully sent to ${payer.email}`,
        );
      } catch (err) {
        this.logger.error(
          `Failed to send payment link email for order ${response.id} to ${payer.email}: ${
            err instanceof Error ? err.message : err
          }`,
        );

        throw new ServiceError(
          'Order created, but payment email could not be sent',
          OrdersService.ERRORS.PaymentErr,
        );
      }
    }

    return response;
  }

  async findByReference(reference: string) {
    const order = await this.prisma.order.findFirst({
      where: { reference },
      include: { ticket: { select: { name: true, validityDates: true } } },
    });

    if (!order) {
      throw new ServiceError(
        'Order not found',
        OrdersService.ERRORS.OrderNotFoundErr,
      );
    }
    let pdfBuffer: Buffer<ArrayBuffer> | undefined;
    if (!order.ticketUrl) {
      pdfBuffer = await this.pdfService.generateDevFest2026Ticket({
        amount: order.amount.toNumber(),
        ticketCode: order.reference.slice(-6),
        downloadUrl: this.generateSignedDownloadUrl(order.reference),
        validity: order.ticket.validityDates.map((d) =>
          d.toLocaleDateString('en-US', { weekday: 'long' }),
        ),
      });
    }

    let ticketUrl: string | undefined;
    if (pdfBuffer) {
      const upload = await this.uploadService.uploadFile(pdfBuffer);
      ticketUrl = upload?.secure_url;
      await this.prisma.order.update({
        where: { id: order.id },
        data: { ticketUrl },
      });
    }

    return {
      ticket: {
        name: order.ticket.name,
        validityDates: order.ticket.validityDates,
        url: order.ticketUrl ?? ticketUrl,
      },
      amount: order.amount.toFixed(2),
      status: order.status,
      code: order.reference.slice(-6),
    };
  }

  async list(query: OrdersQueryDto) {
    const { cursor, direction = 'next', limit = 20, search, status } = query;

    const where: Prisma.OrderWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { attendeeEmail: { contains: search, mode: 'insensitive' } },
        { attendeeFullName: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy =
      direction === 'next' ? { id: 'asc' as const } : { id: 'desc' as const };

    const results = await this.prisma.order.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy,
      include: {
        ticket: { select: { name: true, validityDates: true, id: true } },
      },
    });

    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    const data = results.map((o) => ({
      id: o.id,
      paidAt: o.paidAt,
      amount: o.amount.toFixed(2),
      status: o.status,
      attendeeFullName: o.attendeeFullName,
      attendeeEmail: o.attendeeEmail,
      checkIns: o.checkIns,
      ticket: {
        id: o.ticket.id,
        name: o.ticket.name,
        code: o.reference.slice(-6),
        validity: o.ticket.validityDates
          .map((d) => d.toLocaleDateString('en-US', { weekday: 'short' }))
          .join(' + '),
      },
    }));

    return {
      data,
      meta: {
        nextCursor: hasMore ? (data[data.length - 1]?.id ?? null) : null,
        prevCursor: cursor ?? null,
        limit,
        hasMore,
      },
    };
  }

  private async createOrderRecord(
    tx: TxClient,
    args: {
      slug: string;
      attendeeFullName: string;
      attendeeEmail: string;
      attendeePhoneNumber: string | null;
      gifterName: string | null;
      gifterEmail: string | null;
      createdById?: string | null;
      skipSaleWindowCheck?: boolean;
    },
  ): Promise<CreatedOrderRecord> {
    const [ticket] = await tx.$queryRaw<TicketQueryRawResult[]>`
    SELECT *
    FROM tickets
    WHERE slug = ${args.slug}
    FOR UPDATE;`;

    if (!ticket) {
      throw new ServiceError(
        'Ticket not found',
        OrdersService.ERRORS.TicketNotFoundErr,
      );
    }

    const now = new Date();
    if (
      !args.skipSaleWindowCheck &&
      (now < ticket.sale_starts_at || now > ticket.sale_ends_at)
    ) {
      throw new ServiceError(
        'This ticket is not on sale',
        OrdersService.ERRORS.NotOnSaleErr,
      );
    }

    const activeOrder = await tx.order.findFirst({
      where: {
        ticketId: ticket.id,
        attendeeEmail: args.attendeeEmail,
        OR: [
          { status: OrderStatus.PAID },
          {
            status: OrderStatus.AWAITING_PAYMENT,
            expiresAt: { gt: now },
          },
        ],
      },
      select: { id: true },
    });
    if (activeOrder) {
      throw new ServiceError(
        'You already have an order for this ticket',
        OrdersService.ERRORS.DuplicateErr,
      );
    }

    const amount = ticket.price.minus(ticket.discount);
    if (amount.lte(0)) {
      throw new ServiceError(
        'Ticket price configuration is invalid',
        OrdersService.ERRORS.ValidationErr,
      );
    }

    const paidCount = await tx.order.count({
      where: { ticketId: ticket.id, status: OrderStatus.PAID },
    });
    if (paidCount >= ticket.capacity) {
      throw new ServiceError(
        'Ticket is sold out',
        OrdersService.ERRORS.SoldOutErr,
      );
    }

    const awaitingCount = await tx.order.count({
      where: {
        ticketId: ticket.id,
        status: OrderStatus.AWAITING_PAYMENT,
        expiresAt: { gt: now },
      },
    });
    if (paidCount + awaitingCount >= ticket.capacity) {
      throw new ServiceError(
        'All remaining tickets are currently reserved. Please retry in 10 minutes',
        OrdersService.ERRORS.RetryLaterErr,
      );
    }

    const order = await tx.order.create({
      data: {
        reference: this.generateReference(ticket.name),
        ticketId: ticket.id,
        attendeeFullName: args.attendeeFullName,
        attendeeEmail: args.attendeeEmail,
        attendeePhoneNumber: args.attendeePhoneNumber,
        gifterName: args.gifterName,
        gifterEmail: args.gifterEmail,
        createdById: args.createdById,
        discount: ticket.discount.toFixed(2),
        amount: amount.toFixed(2),
        currency: 'NGN',
        status: OrderStatus.AWAITING_PAYMENT,
        paymentProvider: this.paymentProvider.name,
        expiresAt: new Date(now.getTime() + ORDER_TTL_MINUTES * 60_000),
      },
    });

    return {
      order,
      ticketName: ticket.name,
      ticketSlug: ticket.slug,
      createdById: args.createdById ?? null,
    };
  }

  private async initializeCheckout(
    record: CreatedOrderRecord,
    payer: { fullName: string; email: string },
  ): Promise<CreateOrderResponseDto> {
    const { order, ticketName, ticketSlug, createdById } = record;
    const params: InitializePaymentParams = {
      amount: Number(order.amount),
      customerName: payer.fullName,
      customerEmail: payer.email,
      paymentReference: order.reference,
      description: `GDG Ibadan ticket: ${ticketName}`,
      metadata: { orderId: order.id },
      redirectUrl: `${this.appConfig.checkoutRedirectUrl}`,
    };

    try {
      const initialized = await this.paymentProvider.initializePayment(params);

      const updated = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentProvider: initialized.provider,
          providerTransactionRef: initialized.transactionRef,
          checkoutUrl: initialized.checkoutUrl,
        },
      });

      return this.toResponseDto(
        updated,
        { name: ticketName, slug: ticketSlug },
        initialized.vatAndCharges,
        createdById,
      );
    } catch (err) {
      this.logger.error(
        `Payment initialization failed for order ${order.id}: ${(err as Error).message}`,
      );
      await this.cancel(order.id);

      throw new ServiceError(
        'Unable to initialize payment. Please try again shortly.',
        OrdersService.ERRORS.PaymentErr,
      );
    }
  }

  private toResponseDto(
    order: Order,
    ticket: { name: string; slug: string },
    vatAndCharges: number,
    createdById?: string | null,
  ): CreateOrderResponseDto {
    return {
      id: order.id,
      reference: order.reference,
      status: order.status,
      amount: order.amount.toFixed(2),
      discount: order.discount.toFixed(2),
      vatAndCharges: vatAndCharges.toFixed(2),
      currency: order.currency,
      checkoutUrl: order.checkoutUrl,
      expiresAt: order.expiresAt,
      ticket,
      createdById: createdById ?? null,
    };
  }

  private generateReference(name: string): string {
    return `${name.replace(/\s+/g, '')}-${randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`;
  }

  private async cancel(orderId: string, attempt = 1): Promise<void> {
    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
      this.logger.error(`Cancelled order ${orderId} after failed payment init`);
    } catch (error) {
      if (attempt >= CANCEL_MAX_ATTEMPTS) {
        this.logger.error(
          `Giving up cancelling order ${orderId} after ${attempt} attempts: ${(error as Error).message}. Needs manual cleanup.`,
        );
        return;
      }
      this.logger.warn(
        `Retrying cancellation for order ${orderId} (attempt ${attempt + 1}/${CANCEL_MAX_ATTEMPTS})`,
      );
      await this.cancel(orderId, attempt + 1);
    }
  }

  async handlePaymentSuccess(event: PaymentSuccessPayload): Promise<void> {
    let txResult: {
      refundId: string;
      order: OrderQueryRawResult | null;
      ticket: TicketQueryRawResult | null;
    } = {
      refundId: '',
      order: null,
      ticket: null,
    };

    // Retrying because we're using IsolationLevel.Serializable
    for (let attempt = 1; attempt <= TX_MAX_ATTEMPTS; attempt++) {
      try {
        txResult = await this.prisma.$transaction(
          async (tx) => {
            const [order] = await tx.$queryRaw<OrderQueryRawResult[]>`
            SELECT *
            FROM orders
            WHERE id = ${event.metaData.orderId}
            FOR UPDATE;`;

            if (!order) {
              this.logger.error(`Order not found: ${event.metaData.orderId}`);
              await this.setEventAsProcessed(tx, event.webhookEventId);
              return txResult;
            }

            if (order.status !== OrderStatus.AWAITING_PAYMENT) {
              this.logger.log(
                `Order ${order.id} status is ${order.status}, skipping...
Treating only ${OrderStatus.AWAITING_PAYMENT} orders`,
              );
              await this.setEventAsProcessed(tx, event.webhookEventId);
              return txResult;
            }

            const transactionRefMismatch =
              order.provider_transaction_ref &&
              order.provider_transaction_ref !== event.transactionReference;

            // Since we're expecting only one currency now, this is fine
            const amountMismatch = event.amountPaid < Number(order.amount);

            if (transactionRefMismatch || amountMismatch) {
              this.logger.warn(
                `Sanity check failed for order ${order.id}: ` +
                  `txRef mismatch=${transactionRefMismatch}, amount mismatch=${amountMismatch}`,
              );
              const refund = await this.recordRefund(tx, order, event);
              txResult.refundId = refund.refundId;
              await this.setEventAsProcessed(tx, event.webhookEventId);
              return txResult;
            }

            // Why are we doing this? To lock this row for any other concurrent
            // incoming events for this ticket to avoid other concurrent writes
            // affecting this tx
            const [ticket] = await tx.$queryRaw<TicketQueryRawResult[]>`
              SELECT *
              FROM tickets
              WHERE id = ${order.ticket_id}
              FOR UPDATE;
            `;

            const paidCount = await tx.order.count({
              where: { ticketId: ticket.id, status: OrderStatus.PAID },
            });

            if (paidCount >= ticket.capacity) {
              this.logger.warn(
                `Ticket ${ticket.id} sold out
Initiating refund for order ${order.id}`,
              );
              const refund = await this.recordRefund(tx, order, event);
              txResult.refundId = refund.refundId;
              await this.setEventAsProcessed(tx, event.webhookEventId);
              return txResult;
            }

            const now = new Date();
            const orderIsExpired = order.expires_at < now;
            const awaitingCount = await tx.order.count({
              where: {
                ticketId: ticket.id,
                status: OrderStatus.AWAITING_PAYMENT,
                expiresAt: { gt: now },
              },
            });
            const hasCapacity = paidCount + awaitingCount < ticket.capacity;
            const shouldIssueTicket = !orderIsExpired || hasCapacity;

            if (shouldIssueTicket) {
              await tx.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.PAID, paidAt: now },
              });

              await this.setEventAsProcessed(tx, event.webhookEventId);
              txResult.order = order;
              txResult.ticket = ticket;
              return txResult;
            }

            const refund = await this.recordRefund(tx, order, event);
            txResult.refundId = refund.refundId;
            await this.setEventAsProcessed(tx, event.webhookEventId);
            return txResult;
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        break;
      } catch (err) {
        const isRetryable =
          (err as { code?: string }).code === 'P2034' ||
          (err as { code?: string }).code ===
            PrismaErrors.UNIQUE_CONSTRAINT_VIOLATION;

        if (isRetryable && attempt < TX_MAX_ATTEMPTS) continue;

        this.logger.error(
          `handlePaymentSuccess failed: ${(err as Error).message}`,
        );

        throw err;
      }
    }

    if (txResult.refundId) {
      await this.processRefund({
        orderId: event.metaData.orderId,
        provider: event.provider,
        refundId: txResult.refundId,
      });
    }

    if (txResult.ticket && txResult.order) {
      try {
        const pdfBuffer = await this.pdfService.generateDevFest2026Ticket({
          amount: Number(txResult.order.amount),
          ticketCode: txResult.order.reference.slice(-6),
          downloadUrl: this.generateSignedDownloadUrl(txResult.order.reference),
          validity: txResult.ticket.validity_dates.map((d) =>
            d.toLocaleDateString('en-US', { weekday: 'long' }),
          ),
        });

        if (!pdfBuffer) return;

        const upload = await this.uploadService.uploadFile(pdfBuffer);

        if (!upload?.secure_url) return;

        await this.prisma.order.update({
          where: { id: txResult.order.id },
          data: { ticketUrl: upload.secure_url },
        });
      } catch (err) {
        this.logger.error(
          `Failed to generate ticket PDF for order ${txResult.order.id}: ${(err as Error).message}`,
        );
      }
    }

    // TODO: send confirmation email
    console.log(
      `[TODO] Send confirmation email for order ${txResult.order?.id}`,
    );
  }

  private async recordRefund(
    tx: TxClient,
    order: OrderQueryRawResult,
    payload: CreateRefundRecord,
  ): Promise<{ refundId: string; orderId: string }> {
    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.AWAITING_REFUND },
    });

    const refund = await tx.refund.create({
      data: {
        orderId: order.id,
        email: order.gifter_email ?? order.attendee_email,
        provider: order.payment_provider,
        transactionReference: payload.transactionReference,
        paymentReference: payload.paymentReference,
        refundReference: this.generateRefundReference(),
        status: RefundStatus.PENDING,
      },
    });

    return { refundId: refund.id, orderId: order.id };
  }

  private async processRefund(payload: ProcessRefundPayload): Promise<void> {
    const { refundId, orderId } = payload;
    const refund = await this.prisma.refund.findUnique({
      where: { id: refundId },
    });

    if (!refund || refund.status !== RefundStatus.PENDING) return;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return;

    for (let attempt = 1; attempt <= TX_MAX_ATTEMPTS; attempt++) {
      try {
        await this.prisma.refund.update({
          where: { id: refundId },
          data: { status: RefundStatus.REQUESTED },
        });

        // TODO Use a switch statement to determine which provider to use
        await this.paymentProvider.requestRefund({
          transactionReference: order.providerTransactionRef!,
          refundReference: refund.refundReference,
          amount: Number(order.amount),
          reason: 'Order could not be fulfilled',
        });

        // TODO Handle provider response via webhook
      } catch (err) {
        if ((err as Error).name === 'InsufficientRefundAmountErr') {
          await this.prisma.refund.update({
            where: { id: refundId },
            data: {
              status: RefundStatus.FAILED,
              reason: (err as Error).message,
            },
          });

          this.logger.error(
            `Refund ${refundId} error: ${(err as Error).message}`,
          );

          break;
        }

        if (attempt < TX_MAX_ATTEMPTS) continue;

        this.logger.error(
          `Refund ${refundId} error: ${(err as Error).message}`,
        );
      }
    }
  }

  async handleFailedPayment(payload: {
    webhookEventId: string;
    event: MonnifyRejectedPaymentWebhookEventData;
  }): Promise<void> {
    const order = await this.prisma.order.findFirst({
      where: { reference: payload.event.paymentReference },
    });

    if (!order) {
      this.logger.warn(
        `Order not found for payment reference: ${payload.event.paymentReference}`,
      );
      return;
    }

    if (order.status !== OrderStatus.AWAITING_PAYMENT) {
      this.logger.log(
        `Order ${order.id} status is ${order.status}, skipping cancellation`,
      );
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
      });
      await this.setEventAsProcessed(tx, payload.webhookEventId);
    });

    this.logger.log(`Order ${order.id} updated to CANCELLED`);
  }

  private async setEventAsProcessed(tx: TxClient, eventId: string) {
    await tx.webhookEvent.update({
      where: { id: eventId },
      data: { processed: true },
    });
  }

  private generateRefundReference(): string {
    return `REFUND-${randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`;
  }

  generateSignedDownloadUrl(reference: string): string {
    const signature = crypto
      .createHmac('sha256', this.appConfig.ticketJWTSecret)
      .update(reference)
      .digest('hex');

    const token = Buffer.from(`${reference}:${signature}`).toString(
      'base64url',
    );

    return `${this.appConfig.url}/api/v1/tickets/download?token=${token}`;
  }
}
