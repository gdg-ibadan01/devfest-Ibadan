import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { IAttendee, ICreateAttendee } from './interfaces/attendee.interface';
import { MailService } from '../mail/mail.service';
import { PaymentStatus } from '@prisma/client';
import { PaymentsService } from '../payment/payment.service';
@Injectable()
export class AttendeeService {
  constructor(
    private readonly prisma: PrismaService,
    private mailService: MailService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(createAttendeeDto: CreateAttendeeDto): Promise<ICreateAttendee> {
    const { email, fullName, amount } = createAttendeeDto;

    if (!amount) {
      throw new ConflictException('Payment amount is required');
    }

    // Check if attendee already exists
    const existingAttendee = await this.prisma.attendee.findUnique({
      where: { email },
      include: { payments: { orderBy: { createdAt: 'desc' } } },
    });

    if (existingAttendee) {
      const latestPayment = existingAttendee.payments[0];

      if (!latestPayment) {
        // Attendee exists but no payment yet → create payment
        const paystackResponse = await this.paymentsService.initiatePayment({
          attendeeId: existingAttendee.id,
          email,
          amount,
        });

        const paymentUrl = paystackResponse.data.authorization_url;

        await this.mailService.sendPaymentLinkEmail(
          existingAttendee.email,
          existingAttendee.fullName,
          paymentUrl,
          amount,
        );

        return {
          attendee: existingAttendee,
          payment: paystackResponse,
          paymentUrl,
        };
      }

      if (latestPayment.status === PaymentStatus.SUCCESS) {
        throw new ConflictException(
          'You already have a confirmed ticket with this email',
        );
      }
    }

    // Create a new attendee
    const attendee = await this.prisma.attendee.create({
      data: {
        email,
        fullName,
        phoneNumber: createAttendeeDto.phoneNumber,
        company: createAttendeeDto.company,
        jobTitle: createAttendeeDto.jobTitle,
      },
    });

    return {
      attendee,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [attendees, total] = await Promise.all([
      this.prisma.attendee.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          payments: {
            select: {
              id: true,
              status: true,
              amount: true,
            },
          },
          tickets: {
            select: { id: true },
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
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    return attendee;
  }

  async findByEmail(email: string): Promise<IAttendee | null> {
    return await this.prisma.attendee.findUnique({
      where: { email },
      // include: {
      //   registrations: {
      //     include: {
      //       event: true,
      //       ticket: true,
      //       payment: true,
      //     },
      //   },
      // },
    });
  }

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
