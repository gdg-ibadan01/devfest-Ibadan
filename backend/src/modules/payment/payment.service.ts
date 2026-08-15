import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import {
  IPayment,
  IPaystackResponse,
  IPaystackWebhook,
} from './interfaces/payment.interface';
// import { RegistrationStatus } from '@prisma/client';
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

  async initiatePayment(initiatePaymentDto: InitiatePaymentDto) {
    return null;
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    return null;
  }

  async handleWebhook(payload: IPaystackWebhook) {
    return null;
  }

  async findAll(page = 1, limit = 10) {
    return null;
  }

  async findOne(id: string) {
    return null;
  }

  private async generateTicket(attendeeId: string, paymentId: string) {
    return null;
  }
}
