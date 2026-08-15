import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { ITicket, ITicketVerification } from './interfaces/ticket.interface';
// import { RegistrationStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TicketQueryDto) {
    return null;
  }

  async findOne(id: string) {
    return null;
  }
  // }

  async findByTicketNumber(ticketNumber: string) {
    return null;
  }

  async verifyTicket(ticketNumber: string) {
    return null;
  }

  async checkIn(ticketNumber: string) {
    return null;
  }

  cancelTicket(ticketNumber: string) {
    return null;
  }

  // async getEventTickets(eventId: string) {
  //   return await this.prisma.ticket.findMany({
  //     where: { eventId },
  //     include: {
  //       registration: {
  //         include: {
  //           attendee: {
  //             select: {
  //               id: true,
  //               fullName: true,
  //               email: true,
  //               phoneNumber: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //     orderBy: { createdAt: 'desc' },
  //   });
  // }

  // async getTicketStats(eventId?: string) {
  //   const where = eventId ? { eventId } : {};

  //   const [total, active, used, cancelled, expired] = await Promise.all([
  //     this.prisma.ticket.count({ where }),
  //     this.prisma.ticket.count({
  //       where: { ...where, status: TicketStatus.ACTIVE },
  //     }),
  //     this.prisma.ticket.count({
  //       where: { ...where, status: TicketStatus.USED },
  //     }),
  //     this.prisma.ticket.count({
  //       where: { ...where, status: TicketStatus.CANCELLED },
  //     }),
  //     this.prisma.ticket.count({
  //       where: { ...where, status: TicketStatus.EXPIRED },
  //     }),
  //   ]);

  //   return {
  //     total,
  //     active,
  //     used,
  //     cancelled,
  //     expired,
  //     checkedIn: await this.prisma.registration.count({
  //       where: {
  //         ...(eventId && { eventId }),
  //         isCheckedIn: true,
  //       },
  //     }),
  //   };
  // }
}
