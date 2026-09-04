import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from 'src/common/errors/service-error';
import { CheckInOrderDto } from './dto/check-in.dto';

interface OrderCheckInRow {
  id: string;
  reference: string;
  ticket_id: string;
  check_ins: Date[];
}

@Injectable()
export class AttendeeService {
  static ERRORS = {
    UnmatchedValidityDateErr: 'UnmatchedValidityDateErr',
    TicketNotFoundErr: 'TicketNotFoundErr',
  } as const;
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(payload: CheckInOrderDto) {
    const orderId = payload.orderId.trim();
    const now = new Date();
    const today = now.toDateString();

    return this.prisma.$transaction(async (tx) => {
      const [order] = await tx.$queryRaw<OrderCheckInRow[]>`
        SELECT id, reference, ticket_id, check_ins
        FROM orders
        WHERE id = ${orderId}
        FOR UPDATE;`;

      if (!order) {
        throw new ServiceError(
          'Ticket not found',
          AttendeeService.ERRORS.TicketNotFoundErr,
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
}
