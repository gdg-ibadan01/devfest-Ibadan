import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma, type Order } from '@prisma/client';
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

const ORDER_TTL_MINUTES = 1;
const TX_MAX_ATTEMPTS = 3;

type TxClient = Prisma.TransactionClient;

interface CreatedOrderRecord {
  order: Order;
  ticketName: string;
  ticketSlug: string;
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
        throw err;
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
        maximumSaleUnits: true,
        saleStartsAt: true,
        saleEndsAt: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
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
    if (paidCount >= ticket.maximumSaleUnits) {
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
    const available = ticket.maximumSaleUnits - paidCount;
    if (available < awaitingCount + 1) {
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
        reference: this.generateReference(ticket.name), // FIX what if there is a reference collision?
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
      await this.prisma.order
        .update({
          where: { id: order.id },
          data: { status: OrderStatus.CANCELLED },
        })
        .catch((updateErr) =>
          this.logger.error(
            `Failed to cancel order ${order.id}: ${(updateErr as Error).message}`,
          ),
        );

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
}
