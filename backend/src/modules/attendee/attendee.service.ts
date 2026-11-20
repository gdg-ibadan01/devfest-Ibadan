import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import AppConfig from 'src/config/app.config';
import {
  extractTicketToken,
  verifyTicketToken,
} from 'src/common/utils/ticket-download-url';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from 'src/common/errors/service-error';
import { CheckInOrderDto } from './dto/check-in.dto';
import { CheckedInQueryDto } from './dto/checked-in.dto';
import { CheckInStatsQueryDto } from './dto/check-in-stats.dto';
import {
  EVENT_TIMEZONE,
  eventToday,
  toEventDayKey,
  toStoredDayKey,
} from 'src/common/utils/event-date';
import { OrderStatus } from '@prisma/client';

interface OrderCheckInRow {
  id: string;
  status: OrderStatus;
  reference: string;
  ticket_id: string;
  check_ins: Date[] | null;
  attendee_full_name: string;
  attendee_email: string;
}

/**
 * check_ins is `timestamp(3)` (no tz) holding UTC instants. Convert to the
 * venue's wall-clock time before taking the date/hour.
 */
const eventLocalSql = (col: Prisma.Sql) =>
  Prisma.sql`((${col} AT TIME ZONE 'UTC') AT TIME ZONE ${EVENT_TIMEZONE})`;
const checkInDaySql = (col: Prisma.Sql) =>
  Prisma.sql`(${eventLocalSql(col)})::date`;

const rate = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.round((part / whole) * 1000) / 10;

interface CheckedInOrderRow {
  id: string;
  reference: string;
  amount: Prisma.Decimal;
  status: string;
  attendee_full_name: string;
  attendee_email: string;
  paid_at: Date | null;
  check_ins: Date[];
  ticket_id: string;
  ticket_name: string;
  ticket_validity_dates: Date[];
}

@Injectable()
export class AttendeeService {
  static ERRORS = {
    UnmatchedValidityDateErr: 'UnmatchedValidityDateErr',
    TicketNotFoundErr: 'TicketNotFoundErr',
    CheckInUnpaidOrderErr: 'CheckInUnpaidOrderErr',
    InvalidTicketQrErr: 'InvalidTicketQrErr',
    AmbiguousTicketCodeErr: 'AmbiguousTicketCodeErr',
    NotCheckedInTodayErr: 'NotCheckedInTodayErr',
  } as const;

  static AUDIT = {
    CheckIn: 'CHECK_IN_ATTENDEE',
    DuplicateCheckIn: 'CHECK_IN_DUPLICATE',
    UndoCheckIn: 'UNDO_CHECK_IN',
  } as const;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  /**
   * Check an attendee in for today. `adminId` (the signed-in staff member)
   * is recorded in the audit log so the dashboard can show who checked whom in.
   */
  async checkIn(payload: CheckInOrderDto, adminId?: string) {
    const orderId = payload.orderId.trim();
    const now = new Date();
    const today = eventToday(now);

    return this.prisma.$transaction(async (tx) => {
      // Row lock: two staff scanning the same ticket at once can't both push
      // a check-in — the second waits, then sees the first one's write.
      const [order] = await tx.$queryRaw<OrderCheckInRow[]>`
        SELECT id, reference, status, ticket_id, check_ins,
               attendee_full_name, attendee_email
        FROM orders
        WHERE id = ${orderId}
        FOR UPDATE;`;

      if (!order) {
        throw new ServiceError(
          'Ticket not found',
          AttendeeService.ERRORS.TicketNotFoundErr,
        );
      }

      if (order.status !== OrderStatus.PAID) {
        throw new ServiceError(
          `Cannot check in an order that is not paid (status: ${order.status})`,
          AttendeeService.ERRORS.CheckInUnpaidOrderErr,
        );
      }

      const ticket = await tx.ticket.findUnique({
        where: { id: order.ticket_id },
        select: { name: true, validityDates: true },
      });

      const validDays = (ticket?.validityDates ?? []).map(toStoredDayKey);
      if (!validDays.includes(today)) {
        throw new ServiceError(
          `Ticket not valid for today (${today}). Valid on: ${validDays.join(', ') || 'no dates'}`,
          AttendeeService.ERRORS.UnmatchedValidityDateErr,
        );
      }

      const checkIns = order.check_ins ?? [];
      const existingToday = checkIns.find((d) => toEventDayKey(d) === today);

      const base = {
        orderId: order.id,
        code: order.reference.slice(-6),
        attendeeFullName: order.attendee_full_name,
        attendeeEmail: order.attendee_email,
        ticketName: ticket?.name ?? '',
      };

      const audit = (action: string) =>
        adminId
          ? tx.auditLog.create({
              data: {
                adminId,
                action,
                metadata: {
                  orderId: order.id,
                  reference: order.reference,
                  code: base.code,
                  attendeeFullName: order.attendee_full_name,
                  attendeeEmail: order.attendee_email,
                  ticketId: order.ticket_id,
                  ticketName: base.ticketName,
                  eventDay: today,
                },
              },
            })
          : Promise.resolve();

      if (existingToday) {
        await audit(AttendeeService.AUDIT.DuplicateCheckIn);
        return {
          ...base,
          alreadyCheckedIn: true,
          checkedInAt: existingToday,
          checkIns,
        };
      }

      const updated = await tx.order.update({
        where: { id: order.id },
        data: { checkIns: { push: now } },
        select: { checkIns: true },
      });
      await audit(AttendeeService.AUDIT.CheckIn);

      return {
        ...base,
        alreadyCheckedIn: false,
        checkedInAt: now,
        checkIns: updated.checkIns,
      };
    });
  }

  /**
   * Check in from a scanned ticket QR (the signed download URL printed on
   * every ticket, so tickets already emailed work) or a typed ticket code /
   * reference.
   */
  async scanCheckIn(code: string, adminId?: string) {
    const orderId = await this.resolveScannedOrderId(code);
    return this.checkIn({ orderId }, adminId);
  }

  private async resolveScannedOrderId(raw: string): Promise<string> {
    const value = raw.trim();
    const token = extractTicketToken(value);

    if (token) {
      const reference = verifyTicketToken(
        token,
        this.appConfig.ticketJWTSecret,
      );
      if (!reference) {
        throw new ServiceError(
          'This QR code is not a valid DevFest ticket',
          AttendeeService.ERRORS.InvalidTicketQrErr,
        );
      }
      const order = await this.prisma.order.findFirst({
        where: { reference },
        select: { id: true },
      });
      if (!order) {
        throw new ServiceError(
          'Ticket not found',
          AttendeeService.ERRORS.TicketNotFoundErr,
        );
      }
      return order.id;
    }

    // Typed code: the 6-character code on the ticket (reference suffix) or
    // the full reference.
    const code = value.replace(/^#/, '');
    if (code.length < 4) {
      throw new ServiceError(
        'Enter at least 4 characters of the ticket code',
        AttendeeService.ERRORS.TicketNotFoundErr,
      );
    }
    const matches = await this.prisma.order.findMany({
      where: {
        OR: [
          { reference: { equals: code, mode: 'insensitive' } },
          { reference: { endsWith: code, mode: 'insensitive' } },
        ],
      },
      select: { id: true, status: true },
      take: 5,
    });
    // Prefer paid orders when an old unpaid attempt shares the suffix.
    const paid = matches.filter((m) => m.status === OrderStatus.PAID);
    const candidates = paid.length > 0 ? paid : matches;

    if (candidates.length === 0) {
      throw new ServiceError(
        `No ticket with code ${code.toUpperCase()}`,
        AttendeeService.ERRORS.TicketNotFoundErr,
      );
    }
    if (candidates.length > 1) {
      throw new ServiceError(
        `More than one ticket matches ${code.toUpperCase()} — search by name or email instead`,
        AttendeeService.ERRORS.AmbiguousTicketCodeErr,
      );
    }
    return candidates[0].id;
  }

  /** Remove today's check-in for an order (e.g. wrong person tapped). */
  async undoCheckIn(payload: CheckInOrderDto, adminId: string) {
    const orderId = payload.orderId.trim();
    const today = eventToday();

    return this.prisma.$transaction(async (tx) => {
      const [order] = await tx.$queryRaw<OrderCheckInRow[]>`
        SELECT id, reference, status, ticket_id, check_ins,
               attendee_full_name, attendee_email
        FROM orders
        WHERE id = ${orderId}
        FOR UPDATE;`;

      if (!order) {
        throw new ServiceError(
          'Ticket not found',
          AttendeeService.ERRORS.TicketNotFoundErr,
        );
      }

      const checkIns = order.check_ins ?? [];
      const remaining = checkIns.filter((d) => toEventDayKey(d) !== today);
      const removed = checkIns.filter((d) => toEventDayKey(d) === today);
      if (removed.length === 0) {
        throw new ServiceError(
          `${order.attendee_full_name} is not checked in today`,
          AttendeeService.ERRORS.NotCheckedInTodayErr,
        );
      }

      await tx.order.update({
        where: { id: order.id },
        data: { checkIns: { set: remaining } },
      });
      await tx.auditLog.create({
        data: {
          adminId,
          action: AttendeeService.AUDIT.UndoCheckIn,
          metadata: {
            orderId: order.id,
            reference: order.reference,
            code: order.reference.slice(-6),
            attendeeFullName: order.attendee_full_name,
            attendeeEmail: order.attendee_email,
            ticketId: order.ticket_id,
            eventDay: today,
            removedCheckIns: removed.map((d) => d.toISOString()),
          },
        },
      });

      return {
        orderId: order.id,
        code: order.reference.slice(-6),
        attendeeFullName: order.attendee_full_name,
        checkIns: remaining,
      };
    });
  }

  /**
   * Live check-in numbers for one event day (defaults to today at the venue).
   * "Expected" = paid orders whose ticket is valid on that day.
   */
  async checkInStats(query: CheckInStatsQueryDto) {
    const date = query.date ?? eventToday();
    const ticketFilter = query.ticketId
      ? Prisma.sql`AND t.id = ${query.ticketId}`
      : Prisma.empty;

    const staffTicketFilter = query.ticketId
      ? Prisma.sql`AND a.metadata->>'ticketId' = ${query.ticketId}`
      : Prisma.empty;

    const [byTicket, byHour, totals, byStaff] = await Promise.all([
      this.prisma.$queryRaw<
        {
          ticket_id: string;
          ticket_name: string;
          expected: bigint;
          checked_in: bigint;
        }[]
      >`
        SELECT
          t.id AS ticket_id,
          t.name AS ticket_name,
          COUNT(o.id)::bigint AS expected,
          COUNT(o.id) FILTER (
            WHERE EXISTS (
              SELECT 1
              FROM unnest(COALESCE(o.check_ins, ARRAY[]::timestamp(3)[])) AS c
              WHERE ${checkInDaySql(Prisma.raw('c'))} = ${date}::date
            )
          )::bigint AS checked_in
        FROM tickets t
        JOIN orders o ON o.ticket_id = t.id AND o.status = 'PAID'
        WHERE ${date}::date = ANY(
          SELECT v::date FROM unnest(t.validity_dates) AS v
        )
        ${ticketFilter}
        GROUP BY t.id, t.name
        ORDER BY t.name ASC;`,
      this.prisma.$queryRaw<{ hour: number; count: bigint }[]>`
        SELECT
          EXTRACT(HOUR FROM ${eventLocalSql(Prisma.raw('c'))})::int AS hour,
          COUNT(*)::bigint AS count
        FROM orders o
        JOIN tickets t ON t.id = o.ticket_id
        CROSS JOIN LATERAL unnest(COALESCE(o.check_ins, ARRAY[]::timestamp(3)[])) AS c
        WHERE o.status = 'PAID'
          AND ${checkInDaySql(Prisma.raw('c'))} = ${date}::date
          ${ticketFilter}
        GROUP BY 1
        ORDER BY 1 ASC;`,
      this.prisma.$queryRaw<
        { total_checked_in: bigint; last_check_in_at: Date | null }[]
      >`
        SELECT
          COUNT(DISTINCT o.id) FILTER (
            WHERE cardinality(COALESCE(o.check_ins, ARRAY[]::timestamp(3)[])) > 0
          )::bigint AS total_checked_in,
          (
            SELECT MAX(c)
            FROM orders o2
            JOIN tickets t ON t.id = o2.ticket_id
            CROSS JOIN LATERAL unnest(COALESCE(o2.check_ins, ARRAY[]::timestamp(3)[])) AS c
            WHERE o2.status = 'PAID'
              AND ${checkInDaySql(Prisma.raw('c'))} = ${date}::date
              ${ticketFilter}
          ) AS last_check_in_at
        FROM orders o
        JOIN tickets t ON t.id = o.ticket_id
        WHERE o.status = 'PAID'
        ${ticketFilter};`,
      // Attribution starts from the release that added check-in audit logs.
      this.prisma.$queryRaw<
        {
          admin_id: string;
          full_name: string;
          check_ins: bigint;
          duplicates: bigint;
          undos: bigint;
          last_at: Date | null;
        }[]
      >`
        SELECT
          a.admin_id,
          ad.full_name,
          COUNT(*) FILTER (WHERE a.action = ${AttendeeService.AUDIT.CheckIn})::bigint AS check_ins,
          COUNT(*) FILTER (WHERE a.action = ${AttendeeService.AUDIT.DuplicateCheckIn})::bigint AS duplicates,
          COUNT(*) FILTER (WHERE a.action = ${AttendeeService.AUDIT.UndoCheckIn})::bigint AS undos,
          MAX(a.created_at) AS last_at
        FROM audit_logs a
        JOIN admins ad ON ad.id = a.admin_id
        WHERE a.action IN (
            ${AttendeeService.AUDIT.CheckIn},
            ${AttendeeService.AUDIT.DuplicateCheckIn},
            ${AttendeeService.AUDIT.UndoCheckIn}
          )
          AND ${checkInDaySql(Prisma.raw('a.created_at'))} = ${date}::date
          ${staffTicketFilter}
        GROUP BY a.admin_id, ad.full_name
        ORDER BY check_ins DESC, ad.full_name ASC;`,
    ]);

    const tickets = byTicket.map((r) => {
      const expected = Number(r.expected);
      const checkedIn = Number(r.checked_in);
      return {
        ticketId: r.ticket_id,
        ticketName: r.ticket_name,
        expected,
        checkedIn,
        remaining: Math.max(0, expected - checkedIn),
        checkInRate: rate(checkedIn, expected),
      };
    });

    const expected = tickets.reduce((sum, t) => sum + t.expected, 0);
    const checkedIn = tickets.reduce((sum, t) => sum + t.checkedIn, 0);

    return {
      date,
      timezone: EVENT_TIMEZONE,
      expected,
      checkedIn,
      remaining: Math.max(0, expected - checkedIn),
      checkInRate: rate(checkedIn, expected),
      totalCheckedInAllDays: Number(totals[0]?.total_checked_in ?? 0),
      lastCheckInAt: totals[0]?.last_check_in_at ?? null,
      byTicket: tickets,
      byHour: byHour.map((r) => ({ hour: r.hour, count: Number(r.count) })),
      byStaff: byStaff.map((r) => ({
        adminId: r.admin_id,
        fullName: r.full_name,
        checkIns: Number(r.check_ins),
        duplicateScans: Number(r.duplicates),
        undos: Number(r.undos),
        lastActivityAt: r.last_at,
      })),
    };
  }

  async checkedIn(query: CheckedInQueryDto) {
    const { eventDates, cursor, direction = 'next', limit = 20 } = query;

    const cursorCondition = cursor
      ? direction === 'next'
        ? Prisma.sql`AND o.id > ${cursor}`
        : Prisma.sql`AND o.id < ${cursor}`
      : Prisma.empty;
    const orderDirection = direction === 'next' ? 'ASC' : 'DESC';

    const rows = await this.prisma.$queryRaw<CheckedInOrderRow[]>`
      SELECT
        o.id,
        o.reference,
        o.amount,
        o.status,
        o.attendee_full_name,
        o.attendee_email,
        o.paid_at,
        o.check_ins,
        t.id AS ticket_id,
        t.name AS ticket_name,
        t.validity_dates AS ticket_validity_dates
      FROM orders o
      JOIN tickets t ON t.id = o.ticket_id
      WHERE EXISTS (
        SELECT 1
        FROM unnest(COALESCE(o.check_ins, ARRAY[]::timestamp(3)[])) AS c
        WHERE ${checkInDaySql(Prisma.raw('c'))} = ANY(${eventDates}::date[])
      )
      ${cursorCondition}
      ORDER BY o.id ${Prisma.raw(orderDirection)}
      LIMIT ${limit + 1};`;

    const hasMore = rows.length > limit;
    if (hasMore) rows.pop();

    const data = rows.map((o) => ({
      id: o.id,
      paidAt: o.paid_at,
      amount: Number(o.amount).toFixed(2),
      status: o.status,
      attendeeFullName: o.attendee_full_name,
      attendeeEmail: o.attendee_email,
      checkIns: o.check_ins,
      ticket: {
        id: o.ticket_id,
        name: o.ticket_name,
        code: o.reference.slice(-6),
        validity: o.ticket_validity_dates
          .map((d) =>
            d.toLocaleDateString('en-US', {
              weekday: 'short',
              timeZone: 'UTC',
            }),
          )
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
}
