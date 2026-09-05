import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from 'src/common/errors/service-error';
import { CheckInOrderDto } from './dto/check-in.dto';
import { CheckedInQueryDto } from './dto/checked-in.dto';
import { OrderStatus } from '@prisma/client';

interface OrderCheckInRow {
  id: string;
  status: OrderStatus;
  reference: string;
  ticket_id: string;
  check_ins: Date[];
}

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
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  async checkIn(payload: CheckInOrderDto) {
    const orderId = payload.orderId.trim();
    const now = new Date();
    const today = now.toDateString();

    return this.prisma.$transaction(async (tx) => {
      const [order] = await tx.$queryRaw<OrderCheckInRow[]>`
        SELECT id, reference, status, ticket_id, check_ins
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
          'Cannot check-in unpaid order',
          AttendeeService.ERRORS.CheckInUnpaidOrderErr,
        );
      }

      const ticket = await tx.ticket.findUnique({
        where: { id: order.ticket_id },
        select: { validityDates: true },
      });

      const validToday = (ticket?.validityDates ?? []).some(
        (d) => d.toDateString() === today,
      );
      if (!validToday) {
        throw new ServiceError(
          'Ticket not valid for today',
          AttendeeService.ERRORS.UnmatchedValidityDateErr,
        );
      }

      const alreadyCheckedIn = order.check_ins.some(
        (d) => d.toDateString() === today,
      );
      if (alreadyCheckedIn) {
        return {
          orderId: order.id,
          code: order.reference.slice(-6),
          checkIns: order.check_ins,
        };
      }

      const updated = await tx.order.update({
        where: { id: order.id },
        data: { checkIns: { push: now } },
      });

      return {
        orderId: updated.id,
        code: updated.reference.slice(-6),
        checkIns: updated.checkIns,
      };
    });
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
        WHERE c::date = ANY(${eventDates}::date[])
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
}
