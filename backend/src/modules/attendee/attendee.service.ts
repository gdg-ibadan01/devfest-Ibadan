import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { IAttendee, ICreateAttendee } from './interfaces/attendee.interface';
import { MailService } from '../mail/mail.service';
import { PaymentsService } from '../payment/payment.service';
@Injectable()
export class AttendeeService {
  constructor(
    private readonly prisma: PrismaService,
    private mailService: MailService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(createAttendeeDto: CreateAttendeeDto) {}

  async findAll(page: number = 1, limit: number = 10) {}

  async findOne(id: string) {}

  async findByEmail(email: string) {}

  // async registerForEvent(
  //   attendeeId: string,
  //   registerEventDto: RegisterEventDto,
  // ) {
  //   const { eventId, specialRequests, dietaryRestrictions } = registerEventDto;

  //   const event = await this.prisma.event.findUnique({
  //     where: { id: eventId },
  //   });

  //   if (!event) {
  //     throw new NotFoundException('Event not found');
  //   }

  //   if (event.status !== 'PUBLISHED') {
  //     throw new ConflictException('Event is not available for registration');
  //   }

  //   // Current UTC time
  //   const nowUTC = new Date();

  //   // Registration starts at event.registrationStart
  //   const startUTC = new Date(event.registrationStart);

  //   // Registration ends exactly when event starts
  //   const eventStartUTC = new Date(event.startDate);

  //   // // Too early
  //   // if (nowUTC.getTime() < startUTC.getTime()) {
  //   //   throw new ConflictException('Registration has not yet started');
  //   // }

  //   // Too late
  //   if (nowUTC.getTime() >= eventStartUTC.getTime()) {
  //     throw new ConflictException(
  //       'Registration has closed because the event has started',
  //     );
  //   }

  //   // Check if event is full
  //   if (event.currentAttendees >= event.maxAttendees) {
  //     throw new ConflictException('Event is fully booked');
  //   }

  //   // Check if already registered
  //   const existingRegistration = await this.prisma.registration.findUnique({
  //     where: {
  //       eventId_attendeeId: { eventId, attendeeId },
  //     },
  //   });

  //   if (existingRegistration) {
  //     throw new ConflictException('Already registered for this event');
  //   }

  //   // Register
  //   const registration = await this.prisma.registration.create({
  //     data: {
  //       eventId,
  //       attendeeId,
  //       specialRequests,
  //       dietaryRestrictions,
  //     },
  //     include: { event: true, attendee: true },
  //   });

  //   // Increment count
  //   await this.prisma.event.update({
  //     where: { id: eventId },
  //     data: { currentAttendees: { increment: 1 } },
  //   });

  //   return registration;
  // }

  // async getRegistrations(attendeeId: string) {
  //   const attendee = await this.prisma.attendee.findUnique({
  //     where: { id: attendeeId },
  //     include: { registrations: true },
  //   });

  //   return attendee?.registrations ?? [];
  // }
}
