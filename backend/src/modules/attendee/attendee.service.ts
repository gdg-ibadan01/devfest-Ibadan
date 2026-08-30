import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from '../../common/errors/service-error';
import { OrdersService } from '../order/order.service';
import { MailService } from '../mail/mail.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { AttendeeResponseDto } from './dto/attendee-response.dto';
import { CreateOrderResponseDto } from '../order/create-order.dto';

@Injectable()
export class AttendeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrdersService,
    private readonly mailService: MailService,
  ) {}

  async create(
    dto: CreateAttendeeDto,
    createdById: string,
  ): Promise<AttendeeResponseDto> {
    const order = await this.orderService.create({
      slug: dto.ticketSlug,
      attendee: {
        fullName: dto.fullName,
        email: dto.email,
        phoneNumber: dto.phone,
      },
      gifter:
        dto.gifterName && dto.gifterEmail
          ? { fullName: dto.gifterName, email: dto.gifterEmail }
          : undefined,
    });

    await this.prisma.auditLog.create({
      data: {
        adminId: createdById,
        action: 'CREATE_ATTENDEE',
        metadata: {
          orderId: order.id,
          reference: order.reference,
          attendeeFullName: dto.fullName,
          attendeeEmail: dto.email,
          attendeePhoneNumber: dto.phone ?? null,
          gifterName: dto.gifterName ?? null,
          gifterEmail: dto.gifterEmail ?? null,
          ticketSlug: dto.ticketSlug,
          ticketName: order.ticket.name,
          amount: order.amount,
        },
      },
    });
    this.mailService
      .sendPaymentLinkEmail(
        dto.email,
        dto.fullName,
        order.checkoutUrl ?? '',
        Number(order.amount),
      )
      .catch((err: Error) => {
        console.error(
          `[AttendeeService] Failed to send payment link email to ${dto.email}: ${err.message}`,
        );
      });

    return this.toResponse(order);
  }

  private toResponse(order: CreateOrderResponseDto): AttendeeResponseDto {
    return {
      id: order.id,
      reference: order.reference,
      ticket: {
        name: order.ticket.name,
        slug: order.ticket.slug,
      },
      amount: order.amount,
      discount: order.discount,
      currency: order.currency,
      status: order.status,
      checkoutUrl: order.checkoutUrl,
      expiresAt: order.expiresAt,
    };
  }

  async findAll(_page: number = 1, _limit: number = 10) {}

  async findOne(_id: string) {}

  async findByEmail(_email: string) {}
}
