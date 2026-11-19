import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Discount,
  DiscountType,
  EmailSendStatus,
  OrderStatus,
  Prisma,
  RefundStatus,
  type Order,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from 'src/common/errors/service-error';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';
import { randomString } from 'src/common/transformers/strings';
import { buildSignedTicketDownloadUrl } from 'src/common/utils/ticket-download-url';
import {
  CheckoutSession,
  InitializePaymentParams,
  PaymentProviderName,
} from '../payment/interfaces/payment-provider.interface';
import { PaymentProviderRegistry } from '../payment/payment-provider.registry';
import {
  CreateOrderDto,
  CreateOrderResponseDto,
  OrdersExportQueryDto,
  OrdersQueryDto,
} from './dto/order.dto';
import { TicketsService } from '../ticket/ticket.service';
import crypto from 'node:crypto';
import AppConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { normalizeMessageId } from '../mail/message-id';
import { CreateGroupBuyOrderDto } from './dto/group-buy-order.dto';
import { DuplicateOrderError } from './duplicate-order.error';

const TX_MAX_ATTEMPTS = 3;
const CANCEL_MAX_ATTEMPTS = 3;
const EXPORT_BATCH_SIZE = 500;
const EXPORT_MAX_ROWS = 10_000;

type TxClient = Prisma.TransactionClient;

interface CreatedOrderRecord {
  order: Order;
  /** Every order row created in the transaction (more than one for group buys). */
  orders: Order[];
  ticketName: string;
  ticketSlug: string;
  validityDates: Date[];
  createdById?: string | null;
}

type TicketEmailOutcome = 'sent' | 'failed' | 'deferred';

/** A PENDING ticket email older than this is considered stuck and retried. */
const PENDING_STALE_MS = 5 * 60 * 1000;
/** Wait this long after a failed send before retrying it automatically. */
const FAILED_RETRY_MS = 10 * 60 * 1000;
/** Automatic retries stop after this many sends; an admin can still resend by hand. */
const MAX_TICKET_EMAIL_ATTEMPTS = 5;
const SWEEP_BATCH_SIZE = 20;

interface TicketIssuanceArgs {
  payer: {
    id: string;
    reference: string;
    amount: Prisma.Decimal | number;
    groupReference: string | null;
  };
  validityDates: Date[];
  recipients: {
    id: string;
    reference: string;
    fullName: string;
    email: string;
  }[];
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
  provider: PaymentProviderName;
}

interface CheckoutPayer {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
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
  group_reference: string | null;
}

interface TicketQueryRawResult {
  id: string;
  capacity: number;
  seats_per_unit: number;
  price: Prisma.Decimal;
  sale_starts_at: Date;
  sale_ends_at: Date;
  validity_dates: Date[];
  name: string;
  slug: string;
}

interface GroupPerson {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  isPayer: boolean;
}

interface CreateOrderRecordArgs {
  slug: string;
  attendeeFullName: string;
  attendeeEmail: string;
  attendeePhoneNumber: string | null;
  gifterName: string | null;
  gifterEmail: string | null;
  createdById?: string | null;
  skipSaleWindowCheck?: boolean;
  discountCode?: string;
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
    TicketGroupCapacityExceededErr: 'TicketGroupCapacityExceededErr',
    OrderNotFoundErr: 'OrderNotFoundErr',
    OrderExpiredErr: 'OrderExpiredErr',
    MaxedOutDiscountCodeErr: 'MaxedOutDiscountCodeErr',
    BulkDiscountRecipientMismatchErr: 'BulkDiscountRecipientMismatchErr',
    TicketDiscountCodeMismatchErr: 'TicketDiscountCodeMismatchErr',
    InvalidDiscountCodeErr: 'InvalidDiscountCodeErr',
  } as const;

  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly payments: PaymentProviderRegistry,
    private readonly ticketsService: TicketsService,
    @Inject(AppConfig.KEY)
    private appConfig: ConfigType<typeof AppConfig>,
  ) {}

  async generateOrderReference(
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
              discountCode: payload.discountCode,
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
          'Unable to create order. Retry in a few minutes',
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

    const isFree = record.order.status === OrderStatus.PAID;
    if (isFree) await this.issueFreeTickets(record);

    // The gifter pays for a gift; otherwise the attendee does.
    const payment = isFree
      ? null
      : await this.openCheckout(
          record.order,
          {
            fullName:
              payload.gifter?.fullName.trim() ??
              payload.attendee.fullName.trim(),
            email: gifterEmail ?? attendeeEmail,
            phoneNumber: payload.gifter
              ? null
              : payload.attendee.phoneNumber?.trim() || null,
          },
          record.ticketName,
        );

    return {
      amount: record.order.amount.toFixed(2),
      vatAndCharges: '0.00',
      currency: 'NGN',
      expiresAt: record.order.expiresAt,
      id: record.order.id,
      reference: record.order.reference,
      status: record.order.status,
      isFree,
      ticket: {
        name: record.ticketName,
        slug: record.ticketSlug,
      },
      payment,
    };
  }

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
              discountCode: payload.discountCode,
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
          'Unable to create order. Retry in a few minutes',
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
    if (record.order.status === OrderStatus.PAID) {
      await this.issueFreeTickets(record);
      return this.toResponseDto(
        record.order,
        { name: record.ticketName, slug: record.ticketSlug },
        0,
        record.createdById,
      );
    }

    const response = await this.initializeCheckout(record, payer);

    // if (createdById && response.checkoutUrl) {
    //   this.logger.log(
    //     `Sending payment link email to ${payer.email} for order ${response.id}`,
    //   );
    //   await this.mailService
    //     .sendPaymentLinkEmail(
    //       payer.email,
    //       payer.fullName,
    //       response.checkoutUrl,
    //       Number(response.amount),
    //     )
    //     .then(() => {
    //       this.logger.log(
    //         `Payment link email successfully sent to ${payer.email}`,
    //       );
    //     })
    //     .catch((err) => {
    //       this.logger.error(
    //         `Failed to send payment link email for order ${response.id} to ${payer.email}: ${
    //           err instanceof Error ? err.message : err
    //         }`,
    //       );
    //     });
    // }

    return response;
  }

  /**
   * Re-issues the inline checkout for an unpaid order, on the gateway the
   * order was created with. Used by the pay-link page and "Complete payment".
   */
  async getCheckoutSession(reference: string) {
    const order = await this.prisma.order.findFirst({
      where: { reference },
      include: { ticket: { select: { name: true } } },
    });

    if (!order) {
      throw new ServiceError(
        'Order not found',
        OrdersService.ERRORS.OrderNotFoundErr,
      );
    }

    const summary = {
      reference: order.reference,
      status: order.status,
      provider: order.paymentProvider,
      amount: order.amount.toFixed(2),
      currency: order.currency,
      expiresAt: order.expiresAt,
      ticket: { name: order.ticket.name },
    };

    if (order.status !== OrderStatus.AWAITING_PAYMENT) {
      return { ...summary, payment: null };
    }
    if (order.expiresAt.getTime() <= Date.now()) {
      throw new ServiceError(
        'This order has expired. Please start a new purchase.',
        OrdersService.ERRORS.OrderExpiredErr,
      );
    }
    if (Number(order.amount) <= 0) {
      throw new ServiceError(
        'Payment for this ticket is made by the group payer.',
        OrdersService.ERRORS.ValidationErr,
      );
    }

    const payment = await this.openCheckout(
      order,
      {
        fullName: order.gifterName ?? order.attendeeFullName,
        email: order.gifterEmail ?? order.attendeeEmail,
        phoneNumber: order.gifterEmail ? null : order.attendeePhoneNumber,
      },
      order.ticket.name,
      { cancelOnFailure: false },
    );

    return { ...summary, payment };
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

    // Unpaid orders return their status (no ticket) so the success page can
    // keep polling until the payment webhook confirms them.
    if (order.status !== OrderStatus.PAID) {
      return {
        ticket: {
          name: order.ticket.name,
          validityDates: order.ticket.validityDates,
          url: null,
        },
        amount: order.amount.toFixed(2),
        status: order.status,
        code: '',
        expiresAt: order.expiresAt,
      };
    }

    const ticketUrl = order.ticketUrl
      ? order.ticketUrl
      : await this.ticketsService.ensureTicketPdf(order);

    if (!ticketUrl) {
      throw new InternalServerErrorException('Unable to generate ticket URL');
    }

    return {
      ticket: {
        name: order.ticket.name,
        validityDates: order.ticket.validityDates,
        url: ticketUrl,
      },
      amount: order.amount.toFixed(2),
      status: order.status,
      code: order.reference.slice(-6),
    };
  }

  private buildListWhere(
    query: Pick<OrdersQueryDto, 'search' | 'status' | 'dateFrom' | 'dateTo'>,
  ): Prisma.OrderWhereInput {
    const { search, status, dateFrom, dateTo } = query;

    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      throw new BadRequestException('dateFrom must not be after dateTo');
    }

    const where: Prisma.OrderWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      };
    }
    if (search) {
      where.OR = [
        { attendeeEmail: { contains: search, mode: 'insensitive' } },
        { attendeeFullName: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toListItem(
    o: Order & {
      ticket: { id: string; name: string; validityDates: Date[] };
    },
  ) {
    return {
      id: o.id,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
      amount: o.amount.toFixed(2),
      status: o.status,
      attendeeFullName: o.attendeeFullName,
      attendeeEmail: o.attendeeEmail,
      checkIns: o.checkIns,
      ticketEmailStatus: o.ticketEmailStatus,
      ticketEmailEvent: o.ticketEmailEvent,
      ticketEmailEventDetail: o.ticketEmailEventDetail,
      ticket: {
        id: o.ticket.id,
        name: o.ticket.name,
        code: o.reference.slice(-6),
        validity: o.ticket.validityDates
          .map((d) => d.toLocaleDateString('en-US', { weekday: 'short' }))
          .join(' + '),
      },
    };
  }

  async list(query: OrdersQueryDto) {
    const { cursor, direction = 'next', limit = 20 } = query;

    const where = this.buildListWhere(query);

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

    const data = results.map((o) => this.toListItem(o));

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

  /** Every order matching the filters (capped), with an audit log entry. */
  async exportOrders(query: OrdersExportQueryDto, adminId: string) {
    const where = this.buildListWhere(query);

    const rows: ReturnType<OrdersService['toListItem']>[] = [];
    let cursor: string | undefined;
    let truncated = false;

    while (true) {
      const batch = await this.prisma.order.findMany({
        where,
        take: EXPORT_BATCH_SIZE,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { id: 'asc' },
        include: {
          ticket: { select: { name: true, validityDates: true, id: true } },
        },
      });

      for (const o of batch) {
        if (rows.length >= EXPORT_MAX_ROWS) {
          truncated = true;
          break;
        }
        rows.push(this.toListItem(o));
      }

      if (truncated || batch.length < EXPORT_BATCH_SIZE) break;
      cursor = batch[batch.length - 1].id;
    }

    await this.prisma.auditLog
      .create({
        data: {
          adminId,
          action: 'EXPORT_ORDERS',
          metadata: {
            format: query.format ?? 'csv',
            rowCount: rows.length,
            truncated,
            filters: {
              search: query.search ?? null,
              status: query.status ?? null,
              dateFrom: query.dateFrom ?? null,
              dateTo: query.dateTo ?? null,
            },
          },
        },
      })
      .catch((err: Error) =>
        this.logger.error(`Failed to write export audit log: ${err.message}`),
      );

    return { data: rows, total: rows.length, truncated };
  }

  private async createOrderRecord(
    tx: TxClient,
    args: CreateOrderRecordArgs,
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
      select: {
        status: true,
        amount: true,
        reference: true,
        attendeeEmail: true,
        gifterEmail: true,
        groupReference: true,
      },
    });
    if (activeOrder) {
      throw await this.duplicateOrderError(
        tx,
        activeOrder,
        args.gifterEmail ?? args.attendeeEmail,
      );
    }

    const discount = await this.validateDiscountCode(tx, {
      attendeeEmail: args.attendeeEmail,
      ticketSlug: ticket.slug,
      code: args.discountCode,
      currentDate: now,
    });

    const expectedAmount = this.computeExpectedAmount(ticket.price, discount);
    const isFree = expectedAmount.lte(0);

    const paidCount = await tx.order.count({
      where: { ticketId: ticket.id, status: OrderStatus.PAID },
    });
    if (paidCount >= this.totalSeats(ticket)) {
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
    if (paidCount + awaitingCount >= this.totalSeats(ticket)) {
      throw new ServiceError(
        'All remaining tickets are currently reserved. Please retry in a few minutes',
        OrdersService.ERRORS.RetryLaterErr,
      );
    }

    const provider = this.payments.active();
    const reference = this.generateReference(ticket.name);
    const order = await tx.order.create({
      data: {
        reference,
        ticketId: ticket.id,
        attendeeFullName: args.attendeeFullName,
        attendeeEmail: args.attendeeEmail,
        attendeePhoneNumber: args.attendeePhoneNumber,
        gifterName: args.gifterName,
        gifterEmail: args.gifterEmail,
        createdById: args.createdById,
        amount: expectedAmount.toFixed(2),
        currency: 'NGN',
        status: isFree ? OrderStatus.PAID : OrderStatus.AWAITING_PAYMENT,
        paidAt: isFree ? now : null,
        ticketEmailStatus: isFree ? EmailSendStatus.PENDING : null,
        providerTransactionRef: isFree
          ? this.freeTransactionRef(reference)
          : null,
        paymentProvider: provider.name,
        expiresAt: new Date(now.getTime() + provider.orderTtlMinutes * 60_000),
        discountId: discount ? discount.id : null,
      },
    });

    return {
      order,
      orders: [order],
      ticketName: ticket.name,
      ticketSlug: ticket.slug,
      validityDates: ticket.validity_dates,
      createdById: args.createdById ?? null,
    };
  }

  async generateGroupOrderReference(payload: CreateGroupBuyOrderDto) {
    let rec: CreatedOrderRecord | null = null;
    for (let attempt = 1; attempt <= TX_MAX_ATTEMPTS; attempt++) {
      try {
        rec = await this.prisma.$transaction(
          (tx) => this.createGroupOrderRecords(tx, payload),
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
          'Unable to create order. Retry in a few minutes',
          OrdersService.ERRORS.RetryLaterErr,
        );
      }
    }

    const isFree = rec!.order.status === OrderStatus.PAID;
    if (isFree) await this.issueFreeTickets(rec!);

    const payment = isFree
      ? null
      : await this.openCheckout(
          rec!.order,
          {
            fullName: payload.group.payer.fullName.trim(),
            email: payload.group.payer.email.trim().toLowerCase(),
            phoneNumber: payload.group.payer.phoneNumber?.trim() || null,
          },
          rec!.ticketName,
        );

    return {
      amount: rec!.order.amount.toFixed(2),
      vatAndCharges: '0.00',
      currency: 'NGN',
      expiresAt: rec!.order.expiresAt,
      id: rec!.order.id,
      reference: rec!.order.reference,
      status: rec!.order.status,
      isFree,
      ticket: {
        name: rec!.ticketName,
        slug: rec!.ticketSlug,
      },
      payment,
    };
  }

  private async createGroupOrderRecords(
    tx: TxClient,
    payload: CreateGroupBuyOrderDto,
  ) {
    const { group, discountCode, slug } = payload;
    const members = this.groupPeople(payload.group);
    this.assertUniqueGroupEmails(members);

    const [ticket] = await tx.$queryRaw<TicketQueryRawResult[]>`
    SELECT *
    FROM tickets
    WHERE slug = ${slug}
    FOR UPDATE;`;

    if (!ticket) {
      throw new ServiceError(
        'Ticket not found',
        OrdersService.ERRORS.TicketNotFoundErr,
      );
    }

    if (ticket.seats_per_unit < members.length) {
      throw new ServiceError(
        `Group of ${members.length} exceeds the ${ticket.seats_per_unit} seats covered by one purchase`,
        OrdersService.ERRORS.TicketGroupCapacityExceededErr,
      );
    }

    const now = new Date();
    if (now < ticket.sale_starts_at || now > ticket.sale_ends_at) {
      throw new ServiceError(
        'This ticket is not on sale',
        OrdersService.ERRORS.NotOnSaleErr,
      );
    }

    const activeOrder = await tx.order.findFirst({
      where: {
        ticketId: ticket.id,
        attendeeEmail: { in: members.map((p) => p.email) },
        OR: [
          { status: OrderStatus.PAID },
          {
            status: OrderStatus.AWAITING_PAYMENT,
            expiresAt: { gt: now },
          },
        ],
      },
    });

    if (activeOrder) {
      throw await this.duplicateOrderError(
        tx,
        activeOrder,
        group.payer.email.trim().toLowerCase(),
      );
    }

    const discount = await this.validateDiscountCode(tx, {
      attendeeEmail: group.payer.email.toLowerCase(),
      ticketSlug: ticket.slug,
      code: discountCode,
      currentDate: now,
    });

    const expectedAmount = this.computeExpectedAmount(ticket.price, discount);
    const isFree = expectedAmount.lte(0);

    const paidCount = await tx.order.count({
      where: { ticketId: ticket.id, status: OrderStatus.PAID },
    });
    if (paidCount >= this.totalSeats(ticket)) {
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

    if (paidCount + awaitingCount + members.length > this.totalSeats(ticket)) {
      throw new ServiceError(
        'All remaining tickets are currently reserved. Please retry in a few minutes',
        OrdersService.ERRORS.RetryLaterErr,
      );
    }

    const provider = this.payments.active();
    const groupReference = crypto.randomUUID();
    const bulkOrdersToCreate = members.map((p) => {
      const reference = this.generateReference(ticket.name);
      return {
        reference,
        ticketId: ticket.id,
        groupReference,
        attendeeFullName: p.fullName,
        attendeeEmail: p.email,
        attendeePhoneNumber: p.phoneNumber,
        amount: p.isPayer ? expectedAmount.toFixed(2) : 0,
        currency: 'NGN',
        status: isFree ? OrderStatus.PAID : OrderStatus.AWAITING_PAYMENT,
        paidAt: isFree ? now : null,
        ticketEmailStatus: isFree ? EmailSendStatus.PENDING : null,
        providerTransactionRef: isFree
          ? this.freeTransactionRef(reference)
          : null,
        paymentProvider: provider.name,
        expiresAt: new Date(now.getTime() + provider.orderTtlMinutes * 60_000),
        discountId: discount && p.isPayer ? discount.id : null,
      };
    });

    const orders = await tx.order.createManyAndReturn({
      data: bulkOrdersToCreate,
    });

    const payerEmail = group.payer.email.trim().toLowerCase();
    return {
      order: orders.find(
        (o) => o.attendeeEmail === payerEmail,
      ) as CreatedOrderRecord['order'],
      orders,
      ticketName: ticket.name,
      ticketSlug: ticket.slug,
      validityDates: ticket.validity_dates,
    };
  }

  /**
   * Error for a clashing order. When the clash is an unpaid order that the
   * same payer started, its payable reference is attached so the buyer can
   * finish paying instead of waiting for it to expire.
   */
  private async duplicateOrderError(
    tx: TxClient,
    existing: Pick<
      Order,
      | 'status'
      | 'amount'
      | 'reference'
      | 'attendeeEmail'
      | 'gifterEmail'
      | 'groupReference'
    >,
    payerEmail: string,
  ): Promise<DuplicateOrderError> {
    const alreadyOrdered = new DuplicateOrderError(
      'You already have an order for this ticket',
    );
    if (existing.status !== OrderStatus.AWAITING_PAYMENT) return alreadyOrdered;

    // A group is paid on the payer's order; members' orders are free.
    const payable =
      existing.groupReference && existing.amount.lte(0)
        ? await tx.order.findFirst({
            where: {
              groupReference: existing.groupReference,
              amount: { gt: 0 },
            },
            select: { reference: true, attendeeEmail: true, gifterEmail: true },
          })
        : existing;

    if (
      !payable ||
      (payable.gifterEmail ?? payable.attendeeEmail) !== payerEmail
    ) {
      return alreadyOrdered;
    }
    return new DuplicateOrderError(
      'You already have an unpaid order for this ticket. Complete your payment to get your ticket.',
      payable.reference,
    );
  }

  private groupPeople(group: CreateGroupBuyOrderDto['group']) {
    return [
      {
        fullName: group.payer.fullName,
        email: group.payer.email.trim().toLowerCase(),
        phoneNumber: group.payer.phoneNumber ?? null,
        isPayer: true,
      },
      ...group.members.map((m) => ({
        fullName: m.fullName,
        email: m.email.trim().toLowerCase(),
        phoneNumber: null,
        isPayer: false,
      })),
    ];
  }

  private assertUniqueGroupEmails(people: GroupPerson[]): void {
    const emails = people.map((p) => p.email);
    const duplicates = [
      ...new Set(emails.filter((e, i) => emails.indexOf(e) !== i)),
    ];

    if (duplicates.length) {
      throw new ServiceError(
        `Duplicate email in group: ${duplicates.join(', ')}`,
        OrdersService.ERRORS.ValidationErr,
      );
    }
  }

  private async validateDiscountCode(
    tx: TxClient,
    args: {
      code?: string;
      ticketSlug: string;
      attendeeEmail: string;
      currentDate: Date;
    },
  ): Promise<Discount | null> {
    if (!args.code) return null;

    const discount = await tx.discount.findFirst({
      where: { code: args.code },
    });
    if (!discount) {
      throw new ServiceError('Invalid discount code', 'InvalidDiscountCodeErr');
    }

    if (
      discount.validFrom > args.currentDate ||
      (discount.validTo && discount.validTo < args.currentDate)
    ) {
      throw new ServiceError('Invalid discount code', 'InvalidDiscountCodeErr');
    }

    if (
      discount.type === DiscountType.BULK &&
      !discount.ticketSlugs.includes(args.ticketSlug)
    ) {
      throw new ServiceError(
        'Invalid ticket discount code',
        'TicketDiscountCodeMismatchErr',
      );
    }

    if (
      discount.type === DiscountType.BULK &&
      !discount.recipientEmails.includes(args.attendeeEmail)
    ) {
      throw new ServiceError(
        'Not permitted to use this discount code',
        'BulkDiscountRecipientMismatchErr',
      );
    }

    const paidCount = await tx.order.count({
      where: { discountId: discount.id, status: OrderStatus.PAID },
    });

    if (discount.limit && discount.limit < paidCount) {
      throw new ServiceError(
        'Discount code has reached its maximum usage',
        'MaxedOutDiscountCodeErr',
      );
    }

    const awaitingCount = await tx.order.count({
      where: {
        discountId: discount.id,
        status: OrderStatus.AWAITING_PAYMENT,
        expiresAt: { gt: args.currentDate },
      },
    });
    if (discount.limit && paidCount + awaitingCount >= discount.limit) {
      throw new ServiceError(
        'All remaining discounted seats are currently reserved. Please retry in a few minutes',
        'MaxedOutDiscountCodeErr',
      );
    }

    return discount;
  }

  /**
   * Builds the inline checkout on the order's own gateway. A failure here
   * means the payer cannot pay, so (for a fresh order) the reservation is
   * released and a PaymentErr is raised.
   */
  private async openCheckout(
    order: Pick<
      Order,
      'id' | 'reference' | 'amount' | 'paymentProvider' | 'groupReference'
    >,
    payer: CheckoutPayer,
    ticketName: string,
    options: { cancelOnFailure?: boolean } = {},
  ): Promise<CheckoutSession> {
    try {
      return await this.payments.for(order.paymentProvider).createCheckout({
        orderId: order.id,
        reference: order.reference,
        amount: Number(order.amount),
        customer: payer,
        description: `GDG Ibadan ticket: ${ticketName}`,
      });
    } catch (err) {
      this.logger.error(
        `Checkout setup failed for order ${order.id} (${order.paymentProvider}): ${(err as Error).message}`,
      );
      if (options.cancelOnFailure !== false) {
        if (order.groupReference) {
          await this.prisma.order
            .updateMany({
              where: {
                groupReference: order.groupReference,
                status: OrderStatus.AWAITING_PAYMENT,
              },
              data: { status: OrderStatus.CANCELLED },
            })
            .catch((e: Error) =>
              this.logger.error(
                `Could not release group ${order.groupReference}: ${e.message}`,
              ),
            );
        } else {
          await this.cancel(order.id);
        }
      }
      throw new ServiceError(
        'Unable to initialize payment. Please try again shortly.',
        OrdersService.ERRORS.PaymentErr,
      );
    }
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

    const provider = this.payments.for(order.paymentProvider);

    if (!provider.initializePayment) {
      // Inline-only gateway (ALATPay): the payer completes payment on our
      // own pay page, which opens the gateway popup.
      const checkoutUrl = `${this.appConfig.frontendUrl.replace(/\/+$/, '')}/tickets/pay/${encodeURIComponent(order.reference)}`;
      const updated = await this.prisma.order.update({
        where: { id: order.id },
        data: { checkoutUrl },
      });
      return this.toResponseDto(
        updated,
        { name: ticketName, slug: ticketSlug },
        0,
        createdById,
      );
    }

    try {
      const initialized = await provider.initializePayment(params);

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
      isFree: order.status === OrderStatus.PAID,
      amount: order.amount.toFixed(2),
      vatAndCharges: '0.00',
      currency: order.currency,
      // checkoutUrl: order.checkoutUrl,
      expiresAt: order.expiresAt,
      ticket,
      createdById: createdById ?? null,
    };
  }

  /** Ticket price less the discount, never below zero. */
  private computeExpectedAmount(
    price: Prisma.Decimal,
    discount: Discount | null,
  ): Prisma.Decimal {
    if (!discount && price.lte(0)) {
      throw new ServiceError(
        'Ticket price configuration is invalid',
        OrdersService.ERRORS.ValidationErr,
      );
    }
    return Prisma.Decimal.max(0, price.minus(discount?.amount ?? 0));
  }

  private freeTransactionRef(reference: string): string {
    return `FREE-${reference}`;
  }

  /** Generates the payer's ticket PDF and emails every attendee in the order. */
  private async issueTickets(args: TicketIssuanceArgs): Promise<void> {
    const payerTicketUrl = await this.ticketsService.ensureTicketPdf({
      id: args.payer.id,
      reference: args.payer.reference,
      amount: args.payer.amount,
      groupReference: args.payer.groupReference,
      ticket: { validityDates: args.validityDates },
    });

    if (!payerTicketUrl) {
      this.logger.error(
        `Failed to generate ticket PDF for order ${args.payer.id}`,
      );
    }

    await Promise.allSettled(
      args.recipients.map((row) => this.sendTicketEmail(row)),
    );
  }

  /**
   * Sends one attendee's ticket email and records the outcome on the order, so
   * a rejected, rate-limited or deferred send is visible and is retried.
   *  - 'sent': the provider accepted it.
   *  - 'failed': the provider rejected it (recorded, retried later).
   *  - 'deferred': the mail budget (MAIL_MAX_PER_HOUR/DAY) is used up, so it
   *    was not attempted; it stays PENDING and goes out when there is room.
   * An order already confirmed SENT is never downgraded by a later failure.
   */
  private async sendTicketEmail(row: {
    id: string;
    reference: string;
    fullName: string;
    email: string;
  }): Promise<TicketEmailOutcome> {
    const notConfirmedSent: Prisma.OrderWhereInput = {
      id: row.id,
      OR: [
        { ticketEmailStatus: null },
        { ticketEmailStatus: { not: EmailSendStatus.SENT } },
      ],
    };

    if (this.mailService.remainingBudget() <= 0) {
      this.logger.warn(
        `Mail budget used up; ticket email for order ${row.id} deferred`,
      );
      await this.prisma.order
        .updateMany({
          where: notConfirmedSent,
          data: { ticketEmailStatus: EmailSendStatus.PENDING },
        })
        .catch((e: Error) =>
          this.logger.error(
            `Could not mark order ${row.id} pending: ${e.message}`,
          ),
        );
      return 'deferred';
    }

    let messageId: string | null = null;
    try {
      const info = (await this.mailService.sendTicketConfirmationEmail({
        eventDate: new Date('2026-11-21'),
        fullName: row.fullName,
        ticketCode: row.reference.slice(-6),
        ticketDownloadUrl: this.generateSignedDownloadUrl(row.reference),
        email: row.email,
      })) as { messageId?: string } | undefined;
      messageId = normalizeMessageId(info?.messageId);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Failed to send ticket confirmation email for order ${row.id} to ${row.email}: ${message}`,
      );
      await this.prisma.order
        .updateMany({
          where: notConfirmedSent,
          data: {
            ticketEmailStatus: EmailSendStatus.FAILED,
            ticketEmailError: message.slice(0, 500),
            ticketEmailAttempts: { increment: 1 },
          },
        })
        .catch((e: Error) =>
          this.logger.error(
            `Could not record email failure for order ${row.id}: ${e.message}`,
          ),
        );
      return 'failed';
    }

    this.logger.log(`Ticket confirmation email sent for order ${row.id}`);
    await this.prisma.order
      .update({
        where: { id: row.id },
        data: {
          ticketEmailStatus: EmailSendStatus.SENT,
          ticketEmailSentAt: new Date(),
          ticketEmailError: null,
          ticketEmailAttempts: { increment: 1 },
          // A new send starts a new delivery history.
          ticketEmailMessageId: messageId,
          ticketEmailEvent: null,
          ticketEmailEventAt: null,
          ticketEmailEventDetail: null,
        },
      })
      .catch((e: Error) =>
        this.logger.error(
          `Could not record email success for order ${row.id}: ${e.message}`,
        ),
      );
    return 'sent';
  }

  /**
   * Background retry (run by TicketEmailSweeper). Picks up PAID orders whose
   * ticket email is stuck PENDING (process stopped, or deferred by the mail
   * budget) or FAILED with attempts left, regenerates a missing ticket PDF, and
   * sends. Never exceeds the mail budget and gives up after
   * MAX_TICKET_EMAIL_ATTEMPTS (an admin can still resend by hand).
   */
  async retryUnconfirmedTicketEmails(limit = SWEEP_BATCH_SIZE) {
    const budget = this.mailService.remainingBudget();
    const take = Math.min(limit, Number.isFinite(budget) ? budget : limit);
    if (take <= 0) return { attempted: 0, sent: 0 };

    const now = Date.now();
    const candidates = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PAID,
        OR: [
          {
            ticketEmailStatus: EmailSendStatus.PENDING,
            updatedAt: { lt: new Date(now - PENDING_STALE_MS) },
          },
          {
            ticketEmailStatus: EmailSendStatus.FAILED,
            ticketEmailAttempts: { lt: MAX_TICKET_EMAIL_ATTEMPTS },
            updatedAt: { lt: new Date(now - FAILED_RETRY_MS) },
          },
        ],
      },
      orderBy: { updatedAt: 'asc' },
      take,
      include: { ticket: { select: { validityDates: true } } },
    });

    let attempted = 0;
    let sent = 0;
    for (const order of candidates) {
      // Claim it so a second instance doesn't pick up the same order. Any
      // update bumps updatedAt, so the loser's condition no longer matches.
      const claim = await this.prisma.order.updateMany({
        where: {
          id: order.id,
          ticketEmailStatus: order.ticketEmailStatus,
          updatedAt: order.updatedAt,
        },
        data: { ticketEmailStatus: EmailSendStatus.PENDING },
      });
      if (claim.count === 0) continue;

      if (!order.ticketUrl) {
        await this.ticketsService
          .ensureTicketPdf({
            id: order.id,
            reference: order.reference,
            amount: order.amount,
            groupReference: order.groupReference,
            ticket: { validityDates: order.ticket.validityDates },
          })
          .catch((e: Error) =>
            this.logger.warn(
              `Could not regenerate ticket PDF for order ${order.id}: ${e.message}`,
            ),
          );
      }

      attempted++;
      const outcome = await this.sendTicketEmail({
        id: order.id,
        reference: order.reference,
        fullName: order.attendeeFullName,
        email: order.attendeeEmail,
      });
      if (outcome === 'sent') sent++;
      if (outcome === 'deferred') break;
    }

    if (attempted > 0) {
      this.logger.log(
        `Ticket email retry: ${sent}/${attempted} sent this round`,
      );
    }
    return { attempted, sent };
  }

  /** Orders whose ticket email is not confirmed sent (failed, pending, or from before tracking). */
  private readonly unconfirmedTicketEmailWhere: Prisma.OrderWhereInput = {
    status: OrderStatus.PAID,
    OR: [
      { ticketEmailStatus: null },
      { ticketEmailStatus: { not: EmailSendStatus.SENT } },
    ],
  };

  /** Re-sends one attendee's ticket email (fresh signed link). */
  async resendTicketEmail(orderId: string, adminId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException('Only paid orders have a ticket to send');
    }

    const outcome = await this.sendTicketEmail({
      id: order.id,
      reference: order.reference,
      fullName: order.attendeeFullName,
      email: order.attendeeEmail,
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'RESEND_TICKET_EMAIL',
        metadata: { orderId, email: order.attendeeEmail, outcome },
      },
    });
    // deferred = the mail limit is used up; it goes out automatically later.
    return { sent: outcome === 'sent', deferred: outcome === 'deferred' };
  }

  /**
   * Re-sends to PAID orders whose ticket email is not confirmed, oldest first,
   * up to `limit` and never past the configured hourly/daily mail budget. Call
   * again later to continue; `remaining` says how many are still unconfirmed.
   */
  async resendUnconfirmedTicketEmails(adminId: string, limit = 100) {
    const budget = this.mailService.remainingBudget();
    const take = Math.min(limit, Number.isFinite(budget) ? budget : limit);

    const orders =
      take > 0
        ? await this.prisma.order.findMany({
            where: this.unconfirmedTicketEmailWhere,
            orderBy: { paidAt: 'asc' },
            take,
          })
        : [];

    let sent = 0;
    let attempted = 0;
    let deferred = 0;
    for (const order of orders) {
      const outcome = await this.sendTicketEmail({
        id: order.id,
        reference: order.reference,
        fullName: order.attendeeFullName,
        email: order.attendeeEmail,
      });
      if (outcome === 'deferred') {
        deferred++;
        break;
      }
      attempted++;
      if (outcome === 'sent') sent++;
    }

    const remaining = await this.prisma.order.count({
      where: this.unconfirmedTicketEmailWhere,
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'RESEND_TICKET_EMAILS_BULK',
        metadata: { attempted, sent, deferred, remaining },
      },
    });

    return {
      attempted,
      sent,
      failed: attempted - sent,
      deferred,
      remaining,
      budgetLeft: Number.isFinite(budget)
        ? Math.max(0, budget - orders.length)
        : null,
    };
  }

  /** Counts of PAID orders by ticket-email state (unknown = sent before tracking existed). */
  async ticketEmailSummary() {
    const [sent, failed, pending, unknown] = await Promise.all([
      this.prisma.order.count({
        where: {
          status: OrderStatus.PAID,
          ticketEmailStatus: EmailSendStatus.SENT,
        },
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.PAID,
          ticketEmailStatus: EmailSendStatus.FAILED,
        },
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.PAID,
          ticketEmailStatus: EmailSendStatus.PENDING,
        },
      }),
      this.prisma.order.count({
        where: { status: OrderStatus.PAID, ticketEmailStatus: null },
      }),
    ]);
    return {
      sent,
      failed,
      pending,
      unknown,
      unconfirmed: failed + pending + unknown,
    };
  }

  /** Issues tickets for orders created already PAID because a discount covered the full price. */
  private async issueFreeTickets(record: CreatedOrderRecord): Promise<void> {
    try {
      await this.issueTickets({
        payer: {
          id: record.order.id,
          reference: record.order.reference,
          amount: record.order.amount,
          groupReference: record.order.groupReference,
        },
        validityDates: record.validityDates,
        recipients: record.orders.map((o) => ({
          id: o.id,
          reference: o.reference,
          fullName: o.attendeeFullName,
          email: o.attendeeEmail,
        })),
      });
    } catch (err) {
      // The order is already PAID. findByReference regenerates a missing PDF.
      this.logger.error(
        `Failed to issue tickets for free order ${record.order.id}: ${(err as Error).message}`,
      );
    }
  }

  private generateReference(name: string): string {
    return `${name.replace(/\s+/g, '')}-${randomString(6)}`;
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

  private totalSeats(ticket: {
    capacity: number;
    seats_per_unit: number;
  }): number {
    return ticket.capacity * ticket.seats_per_unit;
  }

  private async cancelGroupMembers(
    tx: TxClient,
    group: OrderQueryRawResult[],
    payerId: string,
  ): Promise<void> {
    const memberIds = group
      .filter((row) => row.id !== payerId)
      .map((row) => row.id);

    if (memberIds.length === 0) return;

    await tx.order.updateMany({
      where: { id: { in: memberIds } },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async handlePaymentSuccess(event: PaymentSuccessPayload): Promise<void> {
    let txResult: {
      refundId: string;
      order: OrderQueryRawResult | null;
      ticket: TicketQueryRawResult | null;
      group: OrderQueryRawResult[];
    } = {
      refundId: '',
      order: null,
      ticket: null,
      group: [],
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

            // A transaction can only settle the order it was opened for.
            if (
              event.paymentReference &&
              order.reference !== event.paymentReference
            ) {
              this.logger.error(
                `Payment reference ${event.paymentReference} does not match order ${order.id} (${order.reference}). Ignoring.`,
              );
              await this.setEventAsProcessed(tx, event.webhookEventId);
              return txResult;
            }

            const group = order.group_reference
              ? await tx.$queryRaw<OrderQueryRawResult[]>`
                  SELECT *
                  FROM orders
                  WHERE group_reference = ${order.group_reference}
                  FOR UPDATE;`
              : [order];

            const isPartlyFulfilled = group.some(
              (row) => row.status !== OrderStatus.AWAITING_PAYMENT,
            );

            if (isPartlyFulfilled) {
              this.logger.log(
                `Order ${order.id} group already has a non-${OrderStatus.AWAITING_PAYMENT} row, treating group as fulfilled. Skipping...`,
              );
              await this.setEventAsProcessed(tx, event.webhookEventId);
              return txResult;
            }

            // Since we're expecting only one currency now, this is fine
            // Half-a-kobo tolerance for float amounts from the gateways.
            const amountMismatch =
              event.amountPaid + 0.005 < Number(order.amount);

            if (amountMismatch) {
              this.logger.warn(
                `Sanity check failed for order ${order.id}: ` +
                  `amount mismatch=${amountMismatch}`,
              );
              const refund = await this.recordRefund(tx, order, event);
              txResult.refundId = refund.refundId;
              await this.cancelGroupMembers(tx, group, order.id);
              await this.setEventAsProcessed(tx, event.webhookEventId);
              return txResult;
            }

            // Why are we doing this? To lock this row for any other concurrent
            // incoming events for this ticket to avoid other concurrent writes
            // affecting this tx
            // TODO maybe no need for this. Normal query is fine
            const [ticket] = await tx.$queryRaw<TicketQueryRawResult[]>`
              SELECT *
              FROM tickets
              WHERE id = ${order.ticket_id}
              FOR UPDATE;
            `;

            const paidCount = await tx.order.count({
              where: { ticketId: ticket.id, status: OrderStatus.PAID },
            });

            if (paidCount >= this.totalSeats(ticket)) {
              this.logger.warn(
                `Ticket ${ticket.id} sold out
Initiating refund for order ${order.id}`,
              );
              const refund = await this.recordRefund(tx, order, event);
              txResult.refundId = refund.refundId;
              await this.cancelGroupMembers(tx, group, order.id);
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
            const hasCapacity =
              paidCount + awaitingCount < this.totalSeats(ticket);
            const shouldIssueTicket = !orderIsExpired || hasCapacity;

            if (shouldIssueTicket) {
              const groupIds = group.map((row) => row.id);

              await tx.order.updateMany({
                where: { id: { in: groupIds } },
                data: {
                  status: OrderStatus.PAID,
                  paidAt: now,
                  providerTransactionRef: event.transactionReference,
                  // Recorded in the same transaction, so if the process stops
                  // before the email goes out the retry job still finds it.
                  ticketEmailStatus: EmailSendStatus.PENDING,
                  ticketEmailAttempts: 0,
                },
              });

              await this.setEventAsProcessed(tx, event.webhookEventId);
              txResult.order = order;
              txResult.ticket = ticket;
              txResult.group = group;
              return txResult;
            }

            const refund = await this.recordRefund(tx, order, event);
            txResult.refundId = refund.refundId;
            await this.cancelGroupMembers(tx, group, order.id);
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

    if (txResult.order && txResult.ticket) {
      // Not awaited: slow mail must not hold the provider's webhook request
      // open. The orders are already PENDING, so a failure or restart here is
      // picked up by the retry job (retryUnconfirmedTicketEmails).
      const orderId = txResult.order.id;
      void this.issueTickets({
        payer: {
          id: txResult.order.id,
          reference: txResult.order.reference,
          amount: txResult.order.amount,
          groupReference: txResult.order.group_reference,
        },
        validityDates: txResult.ticket.validity_dates,
        recipients: txResult.group.map((row) => ({
          id: row.id,
          reference: row.reference,
          fullName: row.attendee_full_name,
          email: row.attendee_email,
        })),
      }).catch((err: Error) =>
        this.logger.error(
          `Failed to issue tickets for order ${orderId}: ${err.message}`,
        ),
      );
    }
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

    // Refund on the gateway that took the payment, not the current switch.
    const provider = this.payments.for(refund.provider);

    for (let attempt = 1; attempt <= TX_MAX_ATTEMPTS; attempt++) {
      try {
        await this.prisma.refund.update({
          where: { id: refundId },
          data: { status: RefundStatus.REQUESTED },
        });

        const result = await provider.requestRefund({
          transactionReference:
            refund.transactionReference || order.providerTransactionRef!,
          refundReference: refund.refundReference,
          amount: Number(order.amount),
          reason: 'Order could not be fulfilled',
        });

        if (result.manual) {
          // No refund API: stays REQUESTED for an admin to refund by hand.
          await this.prisma.refund.update({
            where: { id: refundId },
            data: {
              reason: `MANUAL_REFUND_REQUIRED: ${result.message ?? 'refund the payer from the gateway dashboard'}`,
            },
          });
          this.logger.error(
            `MANUAL_REFUND_REQUIRED for order ${orderId} (refund ${refund.refundReference}, ${refund.provider}, NGN ${Number(order.amount).toFixed(2)}, ${refund.email})`,
          );
        } else if (!result.success) {
          await this.prisma.refund.update({
            where: { id: refundId },
            data: {
              status: RefundStatus.FAILED,
              reason: result.message ?? 'Refund rejected by provider',
            },
          });
          this.logger.error(
            `Refund ${refundId} rejected by ${refund.provider}: ${result.message}`,
          );
        }

        // Requested exactly once; outcome arrives via the provider/admin.
        break;
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
    event: { paymentReference: string };
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

    const cancellationFilter = order.groupReference
      ? { groupReference: order.groupReference }
      : { id: order.id };

    await this.prisma.$transaction(async (tx) => {
      await tx.order.updateMany({
        where: cancellationFilter,
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
    return `REFUND-${randomString(10)}`;
  }

  generateSignedDownloadUrl(reference: string): string {
    return buildSignedTicketDownloadUrl(
      reference,
      this.appConfig.ticketJWTSecret,
      this.appConfig.url,
    );
  }

  async count(where: Prisma.OrderWhereInput): Promise<number> {
    return this.prisma.order.count({ where });
  }

  async sumAmount(where: Prisma.OrderWhereInput): Promise<number> {
    const result = await this.prisma.order.aggregate({
      _sum: { amount: true },
      where,
    });
    return Number(result._sum.amount ?? 0);
  }

  async findMany(args: Prisma.OrderFindManyArgs) {
    return this.prisma.order.findMany(args);
  }

  async groupByTicket() {
    return this.prisma.order.groupBy({
      by: ['ticketId'],
      where: { status: OrderStatus.PAID },
      _count: { _all: true },
    });
  }
}
