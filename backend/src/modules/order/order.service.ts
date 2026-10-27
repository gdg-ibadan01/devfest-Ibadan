import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Discount,
  DiscountType,
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
  InitializePaymentParams,
  PAYMENT_PROVIDER,
  PaymentProvider,
} from '../payment/interfaces/payment-provider.interface';
import { MonnifyRejectedPaymentWebhookEventData } from '../payment/interfaces/monnify.interface';
import {
  CreateOrderDto,
  CreateOrderResponseDto,
  OrdersQueryDto,
} from './dto/order.dto';
import { TicketsService } from '../ticket/ticket.service';
import crypto from 'node:crypto';
import AppConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { CreateGroupBuyOrderDto } from './dto/group-buy-order.dto';

const ORDER_TTL_MINUTES = 5;
const TX_MAX_ATTEMPTS = 3;
const CANCEL_MAX_ATTEMPTS = 3;

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
    MaxedOutDiscountCodeErr: 'MaxedOutDiscountCodeErr',
    BulkDiscountRecipientMismatchErr: 'BulkDiscountRecipientMismatchErr',
    TicketDiscountCodeMismatchErr: 'TicketDiscountCodeMismatchErr',
    InvalidDiscountCodeErr: 'InvalidDiscountCodeErr',
  } as const;

  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
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

    if (order.status !== OrderStatus.PAID) {
      throw new ServiceError(
        'Order payment not confirmed yet',
        OrdersService.ERRORS.ValidationErr,
      );
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
      select: { id: true },
    });
    if (activeOrder) {
      throw new ServiceError(
        'You already have an order for this ticket',
        OrdersService.ERRORS.DuplicateErr,
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
        providerTransactionRef: isFree
          ? this.freeTransactionRef(reference)
          : null,
        paymentProvider: this.paymentProvider.name,
        expiresAt: new Date(now.getTime() + ORDER_TTL_MINUTES * 60_000),
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
      throw new ServiceError(
        'You already have an order for this ticket',
        OrdersService.ERRORS.DuplicateErr,
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
        providerTransactionRef: isFree
          ? this.freeTransactionRef(reference)
          : null,
        paymentProvider: this.paymentProvider.name,
        expiresAt: new Date(now.getTime() + ORDER_TTL_MINUTES * 60_000),
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

    const emailResults = await Promise.allSettled(
      args.recipients.map((row) =>
        this.mailService.sendTicketConfirmationEmail({
          eventDate: new Date('2026-11-21'),
          fullName: row.fullName,
          ticketCode: row.reference.slice(-6),
          ticketDownloadUrl: this.generateSignedDownloadUrl(row.reference),
          email: row.email,
        }),
      ),
    );

    emailResults.forEach((result, index) => {
      const row = args.recipients[index];
      if (result.status === 'rejected') {
        this.logger.error(
          `Failed to send ticket confirmation email for order ${row.id} to ${row.email}: ${
            result.reason instanceof Error
              ? result.reason.message
              : result.reason
          }`,
        );
        return;
      }
      this.logger.log(`Ticket confirmation email sent for order ${row.id}`);
    });
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
            const amountMismatch = event.amountPaid < Number(order.amount);

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
      await this.issueTickets({
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
      });
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
