import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AttendeeListItemDto,
  AttendeeListQueryDto,
  AttendeeListResponseDto,
  AttendeeListSummaryDto,
  DashboardOverviewResponseDto,
  RecentAttendeeDto,
} from './dto/dashboard-response.dto';
import { OrdersService } from 'src/modules/order/order.service';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrdersService,
  ) {}

  private async getStats() {
    const [totalAttendees, ticketsSold, revenue, daysToEvent, checkInStats] =
      await Promise.all([
        this.orderService.count({}),
        this.orderService.count({ status: OrderStatus.PAID }),
        this.orderService.sumAmount({ status: OrderStatus.PAID }),
        this.getDaysToEvent(),
        this.getCheckInStats(),
      ]);

    return {
      totalAttendees,
      ticketsSold,
      revenue,
      daysToEvent,
      ...checkInStats,
    };
  }

  /**
   * Aggregates check-in statistics in a single query.
   * Uses COALESCE(check_ins, ARRAY[]::timestamp(3)[]) for PostgreSQL null-safety,
   * aligning with the pattern in AttendeeService.checkedIn().
   * - totalCheckedIn: distinct paid attendees who have checked in at least once
   * - checkedInToday: distinct paid attendees who checked in today
   */
  private async getCheckInStats(): Promise<{
    totalCheckedIn: number;
    checkedInToday: number;
  }> {
    const [row] = await this.prisma.$queryRaw<
      { total_checked_in: bigint; checked_in_today: bigint }[]
    >`
      SELECT
        COUNT(*) FILTER (
          WHERE cardinality(COALESCE(o.check_ins, ARRAY[]::timestamp(3)[])) > 0
        )::bigint AS total_checked_in,
        COUNT(*) FILTER (
          WHERE EXISTS (
            SELECT 1
            FROM unnest(COALESCE(o.check_ins, ARRAY[]::timestamp(3)[])) AS ci
            WHERE ci::date = CURRENT_DATE
          )
        )::bigint AS checked_in_today
      FROM orders o
      WHERE o.status = 'PAID';
    `;

    return {
      totalCheckedIn: Number(row?.total_checked_in ?? 0),
      checkedInToday: Number(row?.checked_in_today ?? 0),
    };
  }

  private async getDaysToEvent(): Promise<number | null> {
    const tickets = await this.prisma.ticket.findMany({
      select: { eventDates: true },
    });
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const upcoming = tickets
      .flatMap((t) => t.eventDates)
      .map(
        (d) =>
          new Date(
            Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
          ),
      )
      .filter((d) => d.getTime() >= startOfToday.getTime())
      .sort((a, b) => a.getTime() - b.getTime());

    if (upcoming.length === 0) return null;
    const diffDays = Math.round(
      (upcoming[0].getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, diffDays);
  }

  private async getRegistrationTrend() {
    const since = new Date();
    since.setDate(1);
    since.setMonth(since.getMonth() - 5);
    since.setHours(0, 0, 0, 0);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });

    const buckets = new Map<string, number>();
    for (let i = 0; i < 6; i++) {
      const d = new Date(since);
      d.setMonth(d.getMonth() + i);
      buckets.set(MONTH_LABELS[d.getMonth()], 0);
    }

    for (const o of orders) {
      const label = MONTH_LABELS[o.createdAt.getMonth()];
      if (buckets.has(label)) {
        buckets.set(label, (buckets.get(label) ?? 0) + 1);
      }
    }

    return Array.from(buckets.entries()).map(([month, count]) => ({
      month,
      count,
    }));
  }

  private async getTicketBreakdown() {
    const grouped = await this.orderService.groupByTicket();
    const total = grouped.reduce((sum, g) => sum + g._count._all, 0);
    if (total === 0) return [];

    const tickets = await this.prisma.ticket.findMany({
      where: { id: { in: grouped.map((g) => g.ticketId) } },
      select: { id: true, name: true },
    });
    const nameById = new Map(tickets.map((t) => [t.id, t.name]));

    return grouped.map((g) => ({
      ticketName: nameById.get(g.ticketId) ?? 'Unknown',
      percentage: Math.round((g._count._all / total) * 100),
    }));
  }

  private async getRecentAttendees(): Promise<RecentAttendeeDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {},
      take: 6,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { ticket: { select: { name: true } } },
    });

    return orders.map((o) => ({
      id: o.id,
      reference: o.reference.startsWith('#') ? o.reference : `#${o.reference}`,
      date: o.createdAt,
      fullName: o.attendeeFullName,
      email: o.attendeeEmail,
      phone: o.attendeePhoneNumber ?? null,
      ticketType: o.ticket.name,
      amount: Number(o.amount),
      status: o.status,
    }));
  }

  async overview(): Promise<DashboardOverviewResponseDto> {
    const [stats, registrationTrend, ticketBreakdown, recentAttendees] =
      await Promise.all([
        this.getStats(),
        this.getRegistrationTrend(),
        this.getTicketBreakdown(),
        this.getRecentAttendees(),
      ]);

    return { stats, registrationTrend, ticketBreakdown, recentAttendees };
  }

  async attendeeList(
    query: AttendeeListQueryDto,
  ): Promise<AttendeeListResponseDto> {
    const {
      cursor,
      direction = 'next',
      limit = 20,
      search,
      status,
      ticketId,
      dateFrom,
      dateTo,
    } = query;

    const where: Prisma.OrderWhereInput = {};

    if (ticketId) {
      where.ticketId = ticketId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        const start = new Date(dateFrom);
        if (!isNaN(start.getTime())) where.createdAt.gte = start;
      }
      if (dateTo) {
        const end = new Date(dateTo);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }
    }

    if (status && status !== 'ALL') {
      const normalizedStatus = status.toUpperCase();
      if (normalizedStatus === 'CHECKED_IN') {
        where.status = OrderStatus.PAID;
        where.checkIns = { isEmpty: false };
      } else if (normalizedStatus === 'REGISTERED') {
        where.status = OrderStatus.PAID;
        where.checkIns = { isEmpty: true };
      } else if (
        normalizedStatus === 'PENDING' ||
        normalizedStatus === 'AWAITING_PAYMENT'
      ) {
        where.status = OrderStatus.AWAITING_PAYMENT;
      } else if (normalizedStatus === 'CANCELLED') {
        where.status = OrderStatus.CANCELLED;
      } else if (normalizedStatus === 'REFUNDED') {
        where.status = OrderStatus.REFUNDED;
      } else if (normalizedStatus === 'AWAITING_REFUND') {
        where.status = OrderStatus.AWAITING_REFUND;
      } else if (
        Object.values(OrderStatus).includes(normalizedStatus as OrderStatus)
      ) {
        where.status = normalizedStatus as OrderStatus;
      }
    }

    if (search) {
      where.OR = [
        { attendeeFullName: { contains: search, mode: 'insensitive' } },
        { attendeeEmail: { contains: search, mode: 'insensitive' } },
        { attendeePhoneNumber: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [summary, listResult] = await Promise.all([
      this.getAttendeeSummary(),
      this.getPaginatedAttendees(where, cursor, direction, limit),
    ]);

    return {
      summary,
      data: listResult.data,
      meta: {
        nextCursor: listResult.nextCursor,
        prevCursor: cursor ?? null,
        limit,
        hasMore: listResult.hasMore,
      },
    };
  }

  private async getAttendeeSummary(): Promise<AttendeeListSummaryDto> {
    const [total, pending, cancelled, checkedInRow] = await Promise.all([
      this.orderService.count({}),
      this.orderService.count({ status: OrderStatus.AWAITING_PAYMENT }),
      this.orderService.count({ status: OrderStatus.CANCELLED }),
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count
        FROM orders
        WHERE status = 'PAID' AND cardinality(COALESCE(check_ins, ARRAY[]::timestamp(3)[])) > 0;
      `,
    ]);

    return {
      total,
      checkedIn: Number(checkedInRow[0]?.count ?? 0),
      pending,
      cancelled,
    };
  }

  private async getPaginatedAttendees(
    where: Prisma.OrderWhereInput,
    cursor: string | undefined,
    direction: 'next' | 'previous' | undefined,
    limit: number,
  ): Promise<{
    data: AttendeeListItemDto[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    const isPrevious = direction === 'previous';
    const results = await this.prisma.order.findMany({
      where,
      take: isPrevious ? -(limit + 1) : limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { ticket: { select: { name: true } } },
    });

    const hasMore = results.length > limit;
    if (hasMore) {
      if (isPrevious) {
        results.shift();
      } else {
        results.pop();
      }
    }

    const lastId = results[results.length - 1]?.id ?? null;

    const data: AttendeeListItemDto[] = results.map((o) => {
      const checkIns = o.checkIns ?? [];
      const isCheckedIn = checkIns.length > 0;
      let displayStatus = o.status as string;
      if (o.status === OrderStatus.PAID) {
        displayStatus = isCheckedIn ? 'Checked-in' : 'Registered';
      } else if (o.status === OrderStatus.AWAITING_PAYMENT) {
        displayStatus = 'Pending';
      } else if (o.status === OrderStatus.CANCELLED) {
        displayStatus = 'Cancelled';
      } else if (o.status === OrderStatus.REFUNDED) {
        displayStatus = 'Refunded';
      } else if (o.status === OrderStatus.AWAITING_REFUND) {
        displayStatus = 'Awaiting Refund';
      }

      return {
        id: o.id,
        reference: o.reference.startsWith('#')
          ? o.reference
          : `#${o.reference}`,
        name: o.attendeeFullName,
        email: o.attendeeEmail,
        phone: o.attendeePhoneNumber ?? null,
        ticketType: o.ticket.name,
        regDate: o.createdAt,
        amountPaid: Number(o.amount),
        status: o.status,
        displayStatus,
        isCheckedIn,
        checkIns,
      };
    });

    return {
      data,
      nextCursor: hasMore ? lastId : null,
      hasMore,
    };
  }
}
