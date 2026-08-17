import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketResponseDto, TicketQueryDto } from './dto/ticket.dto';
import { CreateTicketDto } from './dto/ticket.dto';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';
import { randomUUID } from 'node:crypto';
import { ServiceError } from 'src/common/errors/service-error';
// import { RegistrationStatus } from '@prisma/client';

const allowedSlugChars = {};
for (const c of 'abcdefghijklmnopqrstuvwxyz0123456789-') {
  allowedSlugChars[c] = true;
}

@Injectable()
export class TicketsService {
  static ERRORS = {
    ValidationErr: 'ValidationErr',
    CreateTickerErr: 'CreateTickerErr',
  };

  private logger = new Logger(TicketsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(jwtUser: IJwtPayload, payload: CreateTicketDto) {
    payload.ensureValidInputs();
    const slug = this.generateSlug(payload.name, payload.validityDates);
    const ticket = await this.createTicket(jwtUser.sub, payload, slug);
    return ticket;
  }

  private async createTicket(
    creatorId: string,
    payload: CreateTicketDto,
    slug: string,
  ): Promise<CreateTicketResponseDto> {
    const saleStartsAt = new Date(payload.saleStartsAt);
    saleStartsAt.setUTCHours(0, 0, 0, 0);
    const saleEndsAt = new Date(payload.saleEndsAt);
    saleEndsAt.setUTCHours(23, 59, 59, 999);
    try {
      const ticket = await this.prisma.ticket.create({
        data: {
          name: payload.name,
          description: payload.description,
          slug,
          creatorId,
          price: payload.price,
          discount: payload.discount,
          maximumSaleUnits: payload.maximumSaleUnits,
          eventDates: payload.eventDates
            .map((dateStr) => new Date(dateStr))
            .sort((da, db) => da.getTime() - db.getTime())
            .map(
              (dateStr) => new Date(dateStr).toISOString() as unknown as Date,
            ),
          validityDates: payload.validityDates
            .map((dateStr) => new Date(dateStr))
            .sort((da, db) => da.getTime() - db.getTime())
            .map(
              (dateStr) => new Date(dateStr).toISOString() as unknown as Date,
            ),
          saleStartsAt: saleStartsAt,
          saleEndsAt: saleEndsAt,
        },
      });

      return {
        id: ticket.id,
        name: ticket.name,
        description: ticket.description,
        slug: ticket.slug,
        price: ticket.price.toNumber(),
        discount: ticket.discount.toNumber(),
        maximumSaleUnits: ticket.maximumSaleUnits,
        eventDates: ticket.eventDates,
        validityDates: ticket.validityDates,
        saleStartsAt: ticket.saleStartsAt,
        saleEndsAt: ticket.saleEndsAt,
        createdAt: ticket.createdAt,
      };
    } catch (err) {
      this.logger.error(err);
      if (
        (err as { code: string }).code ==
        PrismaErrors.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return await this.createTicket(
          creatorId,
          payload,
          slug + randomUUID().slice(0, 6),
        );
      }

      throw new ServiceError('Unable to create ticket', `CreateTicketErr`);
    }
  }

  private generateSlug(name: string, validityDates: string[]) {
    const cleanName = `${name}-${validityDates.join('-')}`.toLowerCase();

    let slug = '';
    let prevIsHyphen = false;

    for (const char of cleanName) {
      if (allowedSlugChars[char]) {
        slug += char;
        prevIsHyphen = false;
      } else {
        if (!prevIsHyphen && slug.length > 0) {
          slug += '-';
          prevIsHyphen = true;
        }
      }
    }

    if (slug.endsWith('-')) {
      slug = slug.slice(0, -1);
    }

    return slug;
  }

  findAll(query: TicketQueryDto) {
    return null;
  }

  findOne(id: string) {
    return null;
  }
  // }

  findByTicketNumber(ticketNumber: string) {
    return null;
  }

  verifyTicket(ticketNumber: string) {
    return null;
  }

  checkIn(ticketNumber: string) {
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
