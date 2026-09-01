import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RefundQueryDto } from './dto/refund-query.dto';
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

  async listRefunds(query: RefundQueryDto) {
    const { cursor, direction = 'next', email } = query;
    const limit = 20;

    const where: Record<string, any> = {};

    if (email) {
      where.email = email.toLowerCase();
    }

    const isForward = direction === 'next';
    const orderBy = isForward
      ? ({ createdAt: 'desc' } as const)
      : ({ createdAt: 'asc' } as const);

    const results = await this.prisma.refund.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy,
      select: {
        id: true,
        email: true,
        provider: true,
        status: true,
        refundedAt: true,
        reason: true,
        createdAt: true,
        order: {
          select: {
            id: true,
            status: true,
            ticket: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    // if (!isForward) {
    //   results.reverse();
    // }

    if (isForward) {
      return {
        data: results,
        meta: {
          nextCursor: hasMore
            ? (results[results.length - 1]?.id ?? null)
            : null,
          prevCursor: cursor ?? null,
          hasMore,
        },
      };
    }

    return {
      data: results,
      meta: {
        nextCursor: cursor ?? null,
        prevCursor: hasMore ? (results[0]?.id ?? null) : null,
        hasMore: false,
      },
    };
  }

  private async generateTicket(attendeeId: string, paymentId: string) {
    return null;
  }
}
