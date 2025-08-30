import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import {
  IPayment,
  IPaystackResponse,
  IPaystackWebhook,
} from './interfaces/payment.interface';
import { PaymentStatus } from '@prisma/client';
import { RegistrationStatus } from '@prisma/client';
import { TicketStatus } from '@prisma/client';

import { MailService } from '../mail/mail.service';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly paystackBaseUrl: string;
  private readonly paystackSecretKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private mailService: MailService,
  ) {
    this.paystackBaseUrl =
      this.configService.get<string>('paystack.baseUrl') ?? '';
    this.paystackSecretKey =
      this.configService.get<string>('paystack.secretKey') ?? '';
  }

  async initiatePayment(
    initiatePaymentDto: InitiatePaymentDto,
  ): Promise<IPaystackResponse> {
    const { eventId, attendeeId, registrationId, email, amount } =
      initiatePaymentDto;

    const registration = await this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true, attendee: true },
    });

    if (!registration) throw new NotFoundException('Registration not found');

    if (
      registration.eventId !== eventId ||
      registration.attendeeId !== attendeeId
    ) {
      throw new BadRequestException('Invalid registration details');
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { registrationId },
    });

    if (existingPayment?.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException(
        'Payment already completed for this registration',
      );
    }

    const paymentReference = `gdg_${Date.now()}_${uuidv4().slice(0, 8)}`;
    const amountInKobo = Math.round(amount * 100);

    const paystackResponse = await axios.post(
      `${this.paystackBaseUrl}/transaction/initialize`,
      {
        email,
        amount: amountInKobo,
        reference: paymentReference,
        metadata: {
          eventId,
          attendeeId,
          registrationId,
          eventTitle: registration.event.title,
          attendeeName: registration.attendee.fullName,
        },
        callback_url: `${this.configService.get('app.url')}/payment/callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!paystackResponse.data.status) {
      throw new BadRequestException('Failed to initialize payment');
    }

    await this.prisma.payment.upsert({
      where: { registrationId },
      create: {
        eventId,
        attendeeId,
        registrationId,
        amount,
        paystackReference: paystackResponse.data.data.reference,
        paymentReference,
        status: PaymentStatus.PENDING,
        metadata: { access_code: paystackResponse.data.data.access_code },
      },
      update: {
        paystackReference: paystackResponse.data.data.reference,
        paymentReference,
        status: PaymentStatus.PENDING,
        metadata: { access_code: paystackResponse.data.data.access_code },
      },
    });

    return paystackResponse.data;
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<IPayment> {
    const { reference } = verifyPaymentDto;

    const paystackResponse = await axios.get(
      `${this.paystackBaseUrl}/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${this.paystackSecretKey}` },
      },
    );

    if (!paystackResponse.data.status) {
      throw new BadRequestException('Payment verification failed');
    }

    const paymentData = paystackResponse.data.data;

    const payment = await this.prisma.payment.findUnique({
      where: { paystackReference: reference },
      include: { registration: { include: { attendee: true, event: true } } },
    });

    if (!payment) throw new NotFoundException('Payment record not found');

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status:
          paymentData.status === 'success'
            ? PaymentStatus.SUCCESS
            : PaymentStatus.FAILED,
        paymentMethod: paymentData.channel,
        paidAt:
          paymentData.status === 'success'
            ? new Date(paymentData.paid_at)
            : undefined,
        failureReason:
          paymentData.status !== 'success'
            ? paymentData.gateway_response
            : undefined,
        metadata: {
          ...(typeof payment.metadata === 'object' && payment.metadata !== null
            ? payment.metadata
            : {}),
          paystackData: paymentData,
        },
      },
    });

    if (paymentData.status === 'success') {
      await this.prisma.registration.update({
        where: { id: payment.registrationId },
        data: { status: RegistrationStatus.CONFIRMED },
      });

      const ticketType = await this.generateTicket(payment.registrationId);

      await this.mailService.sendTicketConfirmationEmail(
        payment.registration?.attendee.email,
        payment.registration?.attendee.fullName,
        payment.registration?.event.title,
        payment.registration?.event.startDate.toDateString(),
        payment.registration?.event.venue,
        ticketType,
        paymentData.id ?? paymentData.transactionId ?? 'N/A',
      );
    } else {
      await this.mailService.sendPaymentFailedEmail(
        payment.registration.attendee.email,
        payment.registration.attendee.fullName,
        `${this.configService.get('app.baseUrl')}/retry-payment/${reference}`,
      );
    }

    return {
      ...updatedPayment,
      amount: Number(updatedPayment.amount),
    } as IPayment;
  }

  async handleWebhook(payload: IPaystackWebhook): Promise<void> {
    if (payload.event !== 'charge.success' && payload.event !== 'charge.failed')
      return;

    const { reference, status, paid_at, channel, gateway_response } =
      payload.data;

    const payment = await this.prisma.payment.findUnique({
      where: { paystackReference: reference },
      include: {
        registration: {
          include: { ticket: true, attendee: true, event: true },
        },
      },
    });

    if (!payment) return;

    if (payment.status !== PaymentStatus.SUCCESS) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status:
            status === 'success' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          paymentMethod: channel,
          paidAt: status === 'success' ? new Date(paid_at) : undefined,
          failureReason: status !== 'success' ? gateway_response : undefined,
          metadata: {
            ...(typeof payment.metadata === 'object' &&
            payment.metadata !== null
              ? payment.metadata
              : {}),
            webhookData: payload.data,
          },
        },
      });

      if (status === 'success') {
        await this.prisma.registration.update({
          where: { id: payment.registrationId },
          data: { status: RegistrationStatus.CONFIRMED },
        });

        const ticketType = await this.generateTicket(payment.registrationId);

        await this.mailService.sendTicketConfirmationEmail(
          payment.registration.attendee.email,
          payment.registration.attendee.fullName,
          payment.registration.event.title,
          payment.registration.event.startDate.toDateString(),
          payment.registration.event.venue,
          ticketType,
          payment.paystackReference,
        );
      } else {
        await this.mailService.sendPaymentFailedEmail(
          payment.registration.attendee.email,
          payment.registration.attendee.fullName,
          `${this.configService.get('app.baseUrl')}/retry-payment/${reference}`,
        );
      }
    }
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: { select: { id: true, title: true } },
          attendee: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.payment.count(),
    ]);

    return {
      data: payments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<IPayment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { event: true, attendee: true, registration: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return { ...payment, amount: Number(payment.amount) } as IPayment;
  }

  private async generateTicket(registrationId: string): Promise<string> {
    const registration = await this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true, ticket: true },
    });

    if (!registration)
      throw new NotFoundException(
        'Registration not found for ticket generation',
      );

    const ticketNumber = `GDG${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const qrCode = `${this.configService.get('app.url')}/tickets/verify/${ticketNumber}`;
    const ticketType = registration.ticketType ?? 'General';

    await this.prisma.ticket.create({
      data: {
        ticketNumber,
        eventId: registration.eventId,
        registrationId,
        qrCode,
        validFrom: registration.event.startDate,
        validUntil: registration.event.endDate,
        ticketType,
        status: TicketStatus.ACTIVE,
      },
    });

    return ticketType;
  }
}
