import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  OrderStatus,
  Prisma,
  RefundStatus,
  Ticket,
  type Order,
} from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from 'src/common/errors/service-error';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';
import {
  InitializePaymentParams,
  PAYMENT_PROVIDER,
  PaymentProvider,
} from '../payment/interfaces/payment-provider.interface';
import { CreateOrderDto, CreateOrderResponseDto } from './create-order.dto';

const ORDER_TTL_MINUTES = 10;
const TX_MAX_ATTEMPTS = 3;

type TxClient = Prisma.TransactionClient;

interface CreatedOrderRecord {
  order: Order;
  ticketName: string;
  ticketSlug: string;
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
  } as Record<string, `${string}Err`>;

  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
  ) {}

  async create(payload: CreateOrderDto): Promise<CreateOrderResponseDto> {
    const attendeeEmail = payload.attendee.email.trim().toLowerCase();
    const gifterEmail = payload.gifter?.email.trim().toLowerCase();

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
        this.logger.error(err);
        throw new ServiceError(
          (err as Error).message,
          (err as Error).name as `${string}Err`,
        );
      }
    }

    return this.initializeCheckout(record, {
      fullName:
        payload.gifter?.fullName.trim() ?? payload.attendee.fullName.trim(),
      email: gifterEmail ?? attendeeEmail,
    });
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
    },
  ): Promise<CreatedOrderRecord> {
    const ticket = await tx.ticket.findUnique({
      where: { slug: args.slug },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        discount: true,
        capacity: true,
        saleStartsAt: true,
        saleEndsAt: true,
      },
    });

    if (!ticket) {
      throw new ServiceError(
        'Ticket not found',
        OrdersService.ERRORS.TicketNotFoundErr,
      );
    }

    const now = new Date();
    if (now < ticket.saleStartsAt || now > ticket.saleEndsAt) {
      throw new ServiceError(
        'This ticket is not on sale',
        OrdersService.ERRORS.NotOnSaleErr,
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

    const order = await tx.order.create({
      data: {
        reference: this.generateReference(ticket.name), // FIX what if there is a collision?
        ticketId: ticket.id,
        attendeeFullName: args.attendeeFullName,
        attendeeEmail: args.attendeeEmail,
        attendeePhoneNumber: args.attendeePhoneNumber,
        gifterName: args.gifterName,
        gifterEmail: args.gifterEmail,
        discount: ticket.discount.toFixed(2),
        amount: amount.toFixed(2),
        currency: 'NGN',
        status: OrderStatus.AWAITING_PAYMENT,
        paymentProvider: this.paymentProvider.name,
        expiresAt: new Date(now.getTime() + ORDER_TTL_MINUTES * 60_000),
      },
    });

    return { order, ticketName: ticket.name, ticketSlug: ticket.slug };
  }

  private async initializeCheckout(
    record: CreatedOrderRecord,
    payer: { fullName: string; email: string },
  ): Promise<CreateOrderResponseDto> {
    const { order, ticketName, ticketSlug } = record;
    const params: InitializePaymentParams = {
      amount: Number(order.amount),
      customerName: payer.fullName,
      customerEmail: payer.email,
      paymentReference: order.reference,
      description: `GDG Ibadan ticket: ${ticketName}`,
      metadata: { orderId: order.id },
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

      return this.toResponseDto(updated, {
        name: ticketName,
        slug: ticketSlug,
      });
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
  ): CreateOrderResponseDto {
    return {
      id: order.id,
      reference: order.reference,
      status: order.status,
      amount: order.amount.toFixed(2),
      discount: order.discount.toFixed(2),
      currency: order.currency,
      checkoutUrl: order.checkoutUrl,
      expiresAt: order.expiresAt,
      ticket,
    };
  }

  private generateReference(name: string): string {
    return `${name.replace(/\s+/g, '')}-${randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`;
  }

  private async cancel(orderId: string) {
    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
      this.logger.error(`Cancelled order ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Failed to cancel order ${orderId}: ${(error as Error).message}...Retrying cancellation`,
      );
      this.logger.error(`Retrying cancellation for order ${orderId}`);
      await this.cancel(orderId);
    }
  }

  async handlePaymentSuccess(event: PaymentSuccessPayload): Promise<void> {
    let txResult: { refundId: string } = {
      refundId: '',
    };

    // Retrying because we're using IsolationLevel.Serializable
    for (let attempt = 1; attempt <= TX_MAX_ATTEMPTS; attempt++) {
      try {
        txResult = await this.prisma.$transaction(
          async (tx) => {
            const [order] = await tx.$queryRaw<Order[]>`
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
              order.providerTransactionRef &&
              order.providerTransactionRef !== event.transactionReference;

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
            const [ticket] = await tx.$queryRaw<Ticket[]>`
              SELECT *
              FROM orders
              WHERE id = ${order.ticketId}
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
            const orderIsExpired = order.expiresAt < now;
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
              // TODO: create attendee record
              console.log(
                `[TODO] Create attendee record for order ${order.id}`,
              );
              // TODO: send confirmation email
              console.log(
                `[TODO] Send confirmation email for order ${order.id}`,
              );
              await this.setEventAsProcessed(tx, event.webhookEventId);
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
  }

  private async recordRefund(
    tx: TxClient,
    order: Order,
    payload: CreateRefundRecord,
  ): Promise<{ refundId: string; orderId: string }> {
    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.AWAITING_REFUND },
    });

    const refund = await tx.refund.create({
      data: {
        orderId: order.id,
        email: order.gifterEmail ?? order.attendeeEmail,
        provider: order.paymentProvider,
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

  private async setEventAsProcessed(tx: TxClient, eventId: string) {
    await tx.webhookEvent.update({
      where: { id: eventId },
      data: { processed: true },
    });
  }
  private generateRefundReference(): string {
    return `REFUND-${randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`;
  }
}
