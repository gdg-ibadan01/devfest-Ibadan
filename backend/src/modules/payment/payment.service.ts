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
// import { RegistrationStatus } from '@prisma/client';
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
    const { attendeeId, email, amount } = initiatePaymentDto;

    const attendee = await this.prisma.attendee.findUnique({
      where: { id: attendeeId },
    });
    if (!attendee) throw new NotFoundException('Attendee not found');

    const paymentReference = `gdg_${Date.now()}_${uuidv4().slice(0, 8)}`;
    const amountInKobo = Math.round(amount * 100);

    const payment = await this.prisma.payment.create({
      data: {
        attendeeId,
        amount,
        paymentReference,
        status: PaymentStatus.PENDING,
      },
    });

    const callbackUrl = `${this.configService.get('app.frontendUrl')}?paymentReference=${payment.paymentReference}&name=${encodeURIComponent(
      attendee.fullName,
    )}&email=${encodeURIComponent(attendee.email)}`;

    const paystackResponse = await axios.post(
      `${this.paystackBaseUrl}/transaction/initialize`,
      {
        email,
        amount: amountInKobo,
        reference: paymentReference,
        metadata: {
          attendeeId,
          attendeeName: attendee.fullName,
          paymentId: payment.id,
        },
        callback_url: callbackUrl,
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

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        paystackReference: paystackResponse.data.data.reference,
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

    const payment = await this.prisma.payment.findFirst({
      where: { paystackReference: reference },
      include: {
        attendee: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!payment) throw new NotFoundException('Payment record not found');

    if (payment.status === PaymentStatus.SUCCESS) {
      return {
        ...payment,
        amount: Number(payment.amount),
        attendee: payment.attendee,
      } as IPayment;
    }

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
      const ticketUrl = `${this.configService.get('app.url')}/tickets/${paymentData.ticketId}`;
      await this.mailService.sendPaymentSuccessEmail(
        payment.attendee.email,
        payment.attendee.fullName,
        payment.amount.toString(),
        ticketUrl,
      );
    } else {
      await this.mailService.sendPaymentFailedEmail(
        payment.attendee.email,
        payment.attendee.fullName,
        `${this.configService.get('app.baseUrl')}/retry-payment/${reference}`,
      );
    }

    return {
      ...updatedPayment,
      amount: Number(updatedPayment.amount),
    } as IPayment;
  }

  async handleWebhook(payload: IPaystackWebhook): Promise<string | void> {
    if (payload.event !== 'charge.success' && payload.event !== 'charge.failed')
      return;

    const { reference, status, paid_at, channel, gateway_response } =
      payload.data;

    const payment = await this.prisma.payment.findFirst({
      where: { paystackReference: reference },
      include: {
        attendee: true,
      },
    });

    if (!payment) return;

    // Update payment if status is not already SUCCESS
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
    }
    // Send emails and generate ticket
    if (status === 'success') {
      const ticket = await this.generateTicket(payment.attendeeId, payment.id);

      await this.mailService.sendTicketConfirmationEmail(
        payment.attendee.email,
        payment.attendee.fullName,
        ticket.ticketType,
        payment.paystackReference ?? '',
        ticket.id,
        ticket.isCheckedIn,
      );
    } else {
      // Payment failed email
      await this.mailService.sendPaymentFailedEmail(
        payment.attendee.email,
        payment.attendee.fullName,
        `${this.configService.get('app.url')}/retry-payment/${reference}`,
      );
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
          attendee: { select: { id: true, fullName: true, email: true } },
          tickets: { select: { ticketNumber: true } },
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
      include: {
        tickets: { select: { ticketNumber: true } },
        attendee: { select: { id: true, fullName: true, email: true } },
      },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return {
      ...payment,
      amount: Number(payment.amount),
      attendee: payment.attendee,
    } as IPayment;
  }

  private async generateTicket(attendeeId: string, paymentId: string) {
    const ticketNumber = `GDG${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const qrCode = `${this.configService.get('app.url')}/tickets/verify/${ticketNumber}`;
    const ticketType = 'General';

    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber,
        qrCode,
        ticketType,
        status: TicketStatus.ACTIVE,
        validFrom: new Date(),
        validUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ),
        attendeeId,
        paymentId,
      },
    });

    return ticket;
  }
}
