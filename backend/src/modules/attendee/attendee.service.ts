import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { IAttendee, ICreateAttendee } from './interfaces/attendee.interface';

@Injectable()
export class AttendeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAttendeeDto: CreateAttendeeDto): Promise<ICreateAttendee> {
    // Check if attendee already exists
    const existingAttendee = await this.prisma.attendee.findUnique({
      where: { email: createAttendeeDto.email },
    });

    if (existingAttendee) {
      throw new ConflictException('Attendee with this email already exists');
    }

    return await this.prisma.attendee.create({
      data: createAttendeeDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [attendees, total] = await Promise.all([
      this.prisma.attendee.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              registrations: true,
            },
          },
        },
      }),
      this.prisma.attendee.count(),
    ]);

    return {
      data: attendees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<IAttendee> {
    const attendee = await this.prisma.attendee.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
                venue: true,
                status: true,
              },
            },
            ticket: true,
            payment: true,
          },
        },
      },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    return attendee;
  }

  async findByEmail(email: string): Promise<IAttendee | null> {
    return await this.prisma.attendee.findUnique({
      where: { email },
      include: {
        registrations: {
          include: {
            event: true,
            ticket: true,
            payment: true,
          },
        },
      },
    });
  }

  async registerForEvent(
    attendeeId: string,
    registerEventDto: RegisterEventDto,
  ) {
    const { eventId, specialRequests, dietaryRestrictions } = registerEventDto;

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new ConflictException('Event is not available for registration');
    }

    // Current UTC time
    const nowUTC = new Date();

    // Registration starts at event.registrationStart
    const startUTC = new Date(event.registrationStart);

    // Registration ends exactly when event starts
    const eventStartUTC = new Date(event.startDate);

    // // Too early
    // if (nowUTC.getTime() < startUTC.getTime()) {
    //   throw new ConflictException('Registration has not yet started');
    // }

    // Too late
    if (nowUTC.getTime() >= eventStartUTC.getTime()) {
      throw new ConflictException(
        'Registration has closed because the event has started',
      );
    }

    // Check if event is full
    if (event.currentAttendees >= event.maxAttendees) {
      throw new ConflictException('Event is fully booked');
    }

    // Check if already registered
    const existingRegistration = await this.prisma.registration.findUnique({
      where: {
        eventId_attendeeId: { eventId, attendeeId },
      },
    });

    if (existingRegistration) {
      throw new ConflictException('Already registered for this event');
    }

    // Register
    const registration = await this.prisma.registration.create({
      data: {
        eventId,
        attendeeId,
        specialRequests,
        dietaryRestrictions,
      },
      include: { event: true, attendee: true },
    });

    // Increment count
    await this.prisma.event.update({
      where: { id: eventId },
      data: { currentAttendees: { increment: 1 } },
    });

    return registration;
  }

  async getRegistrations(attendeeId: string) {
    const attendee = await this.prisma.attendee.findUnique({
      where: { id: attendeeId },
      include: { registrations: true },
    });

    return attendee?.registrations ?? [];
  }
}
