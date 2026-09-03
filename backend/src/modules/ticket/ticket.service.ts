import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import crypto from 'node:crypto';
import {
  CreateTicketResponseDto,
  GetTicketBySlugResponseDto,
  GetTicketResponseDto,
  TicketQueryDto,
} from './dto/ticket.dto';
import { CreateTicketDto } from './dto/ticket.dto';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';
import { randomUUID } from 'node:crypto';
import { ServiceError } from 'src/common/errors/service-error';
import { ConfigType } from '@nestjs/config';
import AppConfig from 'src/config/app.config';

const allowedSlugChars = {};
for (const c of 'abcdefghijklmnopqrstuvwxyz0123456789-') {
  allowedSlugChars[c] = true;
}

@Injectable()
export class TicketsService {
  static ERRORS = {
    ValidationErr: 'ValidationErr',
    CreateTicketErr: 'CreateTicketErr',
    UpdateTicketErr: 'UpdateTicketErr',
  };

  private logger = new Logger(TicketsService.name);
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AppConfig.KEY)
    private appConfig: ConfigType<typeof AppConfig>,
  ) {}

  async create(jwtUser: IJwtPayload, payload: CreateTicketDto) {
    payload.ensureValidInputs();
    const slug = this.generateSlug(payload.name, payload.validityDates);
    const ticket = await this.createTicket(jwtUser.sub, payload, slug);
    return ticket;
  }

  async update(ticketId: string, payload: CreateTicketDto) {
    payload.ensureValidInputs();

    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const saleStartsAt = new Date(payload.saleStartsAt);
    saleStartsAt.setUTCHours(0, 0, 0, 0);
    const saleEndsAt = new Date(payload.saleEndsAt);
    saleEndsAt.setUTCHours(23, 59, 59, 999);

    try {
      const updatedTicket = await this.prisma.ticket.update({
        where: { id: ticketId },
        data: {
          name: payload.name,
          description: payload.description,
          price: Number(payload.price.toFixed(2)),
          discount: Number(payload.discount.toFixed(2)),
          capacity: payload.capacity,
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
        id: updatedTicket.id,
        name: updatedTicket.name,
        description: updatedTicket.description,
        slug: updatedTicket.slug,
        price: updatedTicket.price.toFixed(2),
        discount: updatedTicket.discount.toFixed(2),
        capacity: updatedTicket.capacity,
        eventDates: updatedTicket.eventDates,
        validityDates: updatedTicket.validityDates,
        saleStartsAt: updatedTicket.saleStartsAt,
        saleEndsAt: updatedTicket.saleEndsAt,
        createdAt: updatedTicket.createdAt,
      };
    } catch (err) {
      this.logger.error(err);
      throw new ServiceError('Unable to update ticket', `UpdateTickerErr`);
    }
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
          price: Number(payload.price.toFixed(2)),
          discount: Number(payload.discount.toFixed(2)),
          capacity: payload.capacity,
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
        price: ticket.price.toFixed(2),
        discount: ticket.discount.toFixed(2),
        capacity: ticket.capacity,
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

  async list(query: TicketQueryDto) {
    const { cursor, direction = 'next', limit = 20, name: search } = query;

    const where: Record<string, any> = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const isForward = direction === 'next';
    const orderBy = isForward
      ? ({ createdAt: 'desc' } as const)
      : ({ createdAt: 'asc' } as const);

    const results = await this.prisma.ticket.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        eventDates: true,
        price: true,
        discount: true,
        saleStartsAt: true,
        saleEndsAt: true,
        capacity: true,
      },
    });

    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    if (!isForward) {
      results.reverse();
    }

    const mapped = results.map((t) => ({
      ...t,
      price: t.price.toFixed(2),
      discount: t.discount.toFixed(2),
    }));

    if (isForward) {
      return {
        data: mapped,
        meta: {
          nextCursor: hasMore ? (mapped[mapped.length - 1]?.id ?? null) : null,
          prevCursor: cursor ?? null,
          limit,
          hasMore,
        },
      };
    }

    return {
      data: mapped,
      meta: {
        nextCursor: cursor ?? null,
        prevCursor: hasMore ? (mapped[0]?.id ?? null) : null,
        limit,
        hasMore: false,
      },
    };
  }

  async findOnSale(name?: string) {
    const now = new Date();
    const where: Record<string, any> = {
      saleStartsAt: { lte: now },
      saleEndsAt: { gte: now },
    };

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const tickets = await this.prisma.ticket.findMany({
      where,
      orderBy: { price: 'asc' },
      select: {
        name: true,
        description: true,
        slug: true,
        validityDates: true,
        eventDates: true,
        price: true,
        discount: true,
      },
    });

    return {
      data: tickets.map((t) => ({
        ...t,
        price: t.price.toFixed(2),
        discount: t.discount.toFixed(2),
      })),
    };
  }

  async findOneById(id: string): Promise<GetTicketResponseDto> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: {
          include: { role: true },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return {
      id: ticket.id,
      name: ticket.name,
      description: ticket.description,
      slug: ticket.slug,
      eventDates: ticket.eventDates,
      price: ticket.price.toFixed(2),
      discount: ticket.discount.toFixed(2),
      validityDates: ticket.validityDates,
      capacity: ticket.capacity,
      saleStartsAt: ticket.saleStartsAt,
      saleEndsAt: ticket.saleEndsAt,
      createdAt: ticket.createdAt,
      creator: {
        name: ticket.creator.fullName,
        role: ticket.creator.role.name,
      },
    };
  }
  // }

  async findBySlug(slug: string): Promise<GetTicketBySlugResponseDto> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { slug },
      select: {
        name: true,
        description: true,
        price: true,
        discount: true,
        eventDates: true,
        validityDates: true,
        slug: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return {
      name: ticket.name,
      description: ticket.description,
      price: ticket.price.toFixed(2),
      discount: ticket.discount.toFixed(2),
      eventDates: ticket.eventDates,
      validityDates: ticket.validityDates,
      slug: ticket.slug,
    };
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

  verifyToken(token: string): string {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [payload, signature] = decoded.split(':');

    const expectedSignature = crypto
      .createHmac('sha256', this.appConfig.ticketJWTSecret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new ServiceError('Invalid token', 'InvalidTicketDownloadTokenErr');
    }

    return JSON.parse(payload).reference;
  }
}
