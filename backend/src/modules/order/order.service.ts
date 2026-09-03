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
import { MailService } from '../mail/mail.service';

const ORDER_TTL_MINUTES = 10;
const TX_MAX_ATTEMPTS = 3;
const CANCEL_MAX_ATTEMPTS = 3;

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
    NotFoundErr: 'NotFoundErr',
  } as Record<string, `${string}Err`>;

  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
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
              createdById,
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
      fullName: payload.attendee.fullName.trim(),
      email: attendeeEmail,
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
    if (
      !args.skipSaleWindowCheck &&
      (now < ticket.saleStartsAt || now > ticket.saleEndsAt)
    ) {
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
    if (paidCount + awaitingCount >= ticket.maximumSaleUnits) {
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
        reference: this.generateReference(ticket.name),
        ticketId: ticket.id,
        attendeeFullName: args.attendeeFullName,
        attendeeEmail: args.attendeeEmail,
        attendeePhoneNumber: args.attendeePhoneNumber,
        gifterName: args.gifterName,
        gifterEmail: args.gifterEmail,
        createdById: args.createdById ?? null,
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
      createdById: order.createdById,
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
}
