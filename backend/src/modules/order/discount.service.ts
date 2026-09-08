import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomString } from 'src/common/transformers/strings';
import { CreateDiscountDto } from './create-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateDiscountDto) {
    payload.validateForType();

    const code = `${payload.name.slice(0, 3).toUpperCase()}-${randomString(6)}`;

    const recipientEmails = (payload.recipientEmails ?? []).map((email) =>
      email.toLowerCase(),
    );

    const validFrom = new Date(payload.validFrom);
    validFrom.setUTCHours(0, 0, 0, 0);

    return this.prisma.discount.create({
      data: {
        name: payload.name,
        code,
        type: payload.type,
        amount: payload.amount,
        ticketSlugs: payload.ticketSlugs,
        limit: payload.limit ?? null,
        validFrom,
        forFirstTimersOnly: payload.forFirstTimersOnly ?? false,
        recipientEmails,
        unusedCount: payload.limit ?? 0,
      },
    });
  }
}
