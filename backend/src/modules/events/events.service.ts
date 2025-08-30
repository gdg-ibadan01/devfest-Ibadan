import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { IEvent, ICreateEvent } from './interfaces/event.interface';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    adminId: string,
  ): Promise<IEvent> {
    const slug = this.generateSlug(createEventDto.title);

    // Check if slug already exists
    const existingEvent = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      throw new BadRequestException('Event with similar title already exists');
    }

    const eventData: ICreateEvent = {
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
      registrationStart: new Date(createEventDto.registrationStart),
      registrationEnd: new Date(createEventDto.registrationEnd),
      createdById: adminId,
    };

    const createdEvent = await this.prisma.event.create({
      data: {
        ...eventData,
        slug,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });
    // Convert Decimal to number
    return {
      ...createdEvent,
      price:
        createdEvent.price !== null ? Number(createdEvent.price) : undefined,
    };
  }

  async findAll(query: EventQueryDto) {
    const {
      search,
      status,
      startDate,
      endDate,
      tag,
      page = 1,
      limit = 10,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (startDate) {
      where.startDate = { gte: new Date(startDate) };
    }

    if (endDate) {
      where.endDate = { lte: new Date(endDate) };
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          _count: {
            select: {
              registrations: true,
            },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<IEvent> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        registrations: {
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
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      ...event,
      price: event.price !== null ? Number(event.price) : undefined,
    };
  }

  async findBySlug(slug: string): Promise<IEvent> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      ...event,
      price: event.price !== null ? Number(event.price) : undefined,
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<IEvent> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        registrations: true,
        createdBy: true,
      },
    });

    const updateData: any = { ...updateEventDto };

    // Convert date strings to Date objects if provided
    if (updateEventDto.startDate) {
      updateData.startDate = new Date(updateEventDto.startDate);
    }
    if (updateEventDto.endDate) {
      updateData.endDate = new Date(updateEventDto.endDate);
    }
    if (updateEventDto.registrationStart) {
      updateData.registrationStart = new Date(updateEventDto.registrationStart);
    }
    if (updateEventDto.registrationEnd) {
      updateData.registrationEnd = new Date(updateEventDto.registrationEnd);
    }

    // Update slug if title is changed
    if (updateEventDto.title && updateEventDto.title !== event?.title) {
      updateData.slug = this.generateSlug(updateEventDto.title);
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });
    // Convert Decimal to number
    return {
      ...updatedEvent,
      price:
        updatedEvent.price !== null ? Number(updatedEvent.price) : undefined,
    };
  }

  async remove(id: string): Promise<void> {
    await this.prisma.event.findUnique({
      where: { id },
      include: {
        registrations: true,
        createdBy: true,
      },
    });
    await this.prisma.event.delete({ where: { id } });
  }

  async updateStatus(id: string, status: EventStatus): Promise<IEvent> {
    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: { status },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    return {
      ...updatedEvent,
      price:
        updatedEvent.price !== null ? Number(updatedEvent.price) : undefined,
    };
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() +
      '-' +
      Date.now()
    );
  }
}
