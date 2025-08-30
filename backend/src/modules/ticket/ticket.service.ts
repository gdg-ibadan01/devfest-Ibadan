import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { ITicket, ITicketVerification } from './interfaces/ticket.interface';
import { TicketStatus } from '@prisma/client';
import { RegistrationStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TicketQueryDto) {
    const { eventId, status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (eventId) {
      where.eventId = eventId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        {
          registration: {
            attendee: {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
              venue: true,
            },
          },
          registration: {
            include: {
              attendee: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      data: tickets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ITicket> {
    const ticketRecord = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
        registration: {
          include: {
            attendee: true,
            payment: true,
          },
        },
      },
    });

    if (!ticketRecord) {
      throw new NotFoundException('Ticket not found');
    }

    const ticket: ITicket = {
      id: ticketRecord.id,
      ticketNumber: ticketRecord.ticketNumber,
      eventId: ticketRecord.eventId,
      registrationId: ticketRecord.registrationId,
      registration: ticketRecord.registration
        ? {
            status: ticketRecord.registration.status,
            isCheckedIn: ticketRecord.registration.isCheckedIn,
            checkInTime: ticketRecord.registration.checkInTime ?? undefined,
          }
        : undefined,
      qrCode: ticketRecord.qrCode,
      status: ticketRecord.status,
      issuedAt: ticketRecord.issuedAt,
      validFrom: ticketRecord.validFrom,
      validUntil: ticketRecord.validUntil,
      createdAt: ticketRecord.createdAt,
      updatedAt: ticketRecord.updatedAt,
    };

    return ticket;
  }

  async findByTicketNumber(ticketNumber: string): Promise<ITicket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { ticketNumber },
      include: {
        event: true,
        registration: {
          include: {
            attendee: true,
            payment: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async verifyTicket(ticketNumber: string): Promise<ITicketVerification> {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { ticketNumber },
        include: { registration: true },
      });

      if (!ticket) {
        return {
          isValid: false,
          message: 'Ticket not found',
        };
      }

      const now = new Date();

      // Check if ticket is active
      if (ticket.status !== TicketStatus.ACTIVE) {
        return {
          isValid: false,
          ticket,
          message: `Ticket is ${ticket.status.toLowerCase()}`,
        };
      }

      // Check if ticket is within valid date range
      if (now < ticket.validFrom) {
        return {
          isValid: false,
          ticket,
          message: 'Ticket is not yet valid',
        };
      }

      if (now > ticket.validUntil) {
        return {
          isValid: false,
          ticket,
          message: 'Ticket has expired',
        };
      }

      // Ensure registration exists and is confirmed
      if (
        !ticket.registration ||
        ticket.registration.status !== RegistrationStatus.CONFIRMED
      ) {
        return {
          isValid: false,
          ticket,
          message: 'Registration is not confirmed',
        };
      }

      return {
        isValid: true,
        ticket,
        message: 'Ticket is valid',
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'An error occurred while verifying the ticket',
      };
    }
  }

  async checkIn(ticketNumber: string): Promise<ITicket> {
    const verification = await this.verifyTicket(ticketNumber);

    if (!verification.isValid || !verification.ticket) {
      throw new BadRequestException(verification.message);
    }

    const ticket = verification.ticket;

    if (!ticket.registration) {
      throw new BadRequestException('No registration found for this ticket');
    }

    if (ticket.registration.isCheckedIn) {
      throw new BadRequestException('Attendee is already checked in');
    }

    await this.prisma.registration.update({
      where: { id: ticket.registrationId },
      data: {
        isCheckedIn: true,
        checkInTime: new Date(),
      },
    });

    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.USED,
      },
      include: {
        event: true,
        registration: {
          include: {
            attendee: true,
          },
        },
      },
    });

    return updatedTicket;
  }

  async cancelTicket(ticketNumber: string): Promise<ITicket> {
    const ticket = await this.findByTicketNumber(ticketNumber);

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Ticket is already cancelled');
    }

    if (ticket.status === TicketStatus.USED) {
      throw new BadRequestException('Cannot cancel a used ticket');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.CANCELLED,
      },
      include: {
        event: true,
        registration: {
          include: {
            attendee: true,
          },
        },
      },
    });

    await this.prisma.registration.update({
      where: { id: ticket.registrationId },
      data: {
        status: RegistrationStatus.CANCELLED,
      },
    });

    await this.prisma.event.update({
      where: { id: ticket.eventId },
      data: {
        currentAttendees: {
          decrement: 1,
        },
      },
    });

    return updatedTicket;
  }

  async getEventTickets(eventId: string) {
    return await this.prisma.ticket.findMany({
      where: { eventId },
      include: {
        registration: {
          include: {
            attendee: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTicketStats(eventId?: string) {
    const where = eventId ? { eventId } : {};

    const [total, active, used, cancelled, expired] = await Promise.all([
      this.prisma.ticket.count({ where }),
      this.prisma.ticket.count({
        where: { ...where, status: TicketStatus.ACTIVE },
      }),
      this.prisma.ticket.count({
        where: { ...where, status: TicketStatus.USED },
      }),
      this.prisma.ticket.count({
        where: { ...where, status: TicketStatus.CANCELLED },
      }),
      this.prisma.ticket.count({
        where: { ...where, status: TicketStatus.EXPIRED },
      }),
    ]);

    return {
      total,
      active,
      used,
      cancelled,
      expired,
      checkedIn: await this.prisma.registration.count({
        where: {
          ...(eventId && { eventId }),
          isCheckedIn: true,
        },
      }),
    };
  }
}
