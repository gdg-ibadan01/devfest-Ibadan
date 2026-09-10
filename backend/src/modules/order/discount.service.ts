import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomString } from 'src/common/transformers/strings';
import { CreateDiscountDto, DiscountListQueryDto } from './dto/discount.dto';

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

    return this.prisma.discount
      .create({
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          amount: true,
          ticketSlugs: true,
          limit: true,
          validFrom: true,
          forFirstTimersOnly: true,
          recipientEmails: true,
          createdAt: true,
        },
        data: {
          name: payload.name,
          code,
          type: payload.type,
          amount: payload.amount,
          ticketSlugs: [...new Set(payload.ticketSlugs)],
          limit: payload.limit,
          validFrom,
          validTo: new Date(
            new Date(payload.validTo).setUTCHours(23, 59, 59, 999),
          ),
          forFirstTimersOnly: payload.forFirstTimersOnly ?? false,
          recipientEmails: payload.type === 'BULK' ? recipientEmails : [],
        },
      })
      .then((result) => ({ ...result, amount: result.amount.toFixed(2) }));
  }

  async findByCode(code: string) {
    const discount = await this.prisma.discount.findUnique({
      where: { code },
      select: { amount: true, validFrom: true, validTo: true },
    });
    if (!discount) throw new NotFoundException('Discount not found');
    const now = new Date();
    return {
      amount: discount.amount.toFixed(2),
      isActive:
        discount.validFrom <= now &&
        (!discount.validTo || discount.validTo >= now),
    };
  }

  async list(query: DiscountListQueryDto) {
    const { cursor, direction = 'next', limit = 20, name } = query;

    const where: { name?: { contains: string; mode: 'insensitive' } } = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const orderBy =
      direction === 'next' ? { id: 'asc' as const } : { id: 'desc' as const };

    const results = await this.prisma.discount.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy,
      select: {
        id: true,
        type: true,
        amount: true,
        code: true,
        validFrom: true,
        validTo: true,
        name: true,
        limit: true,
        createdAt: true,
        ticketSlugs: true,
        _count: {
          select: {
            orders: { where: { status: OrderStatus.PAID } },
          },
        },
      },
    });

    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    const slugs = results.flatMap((d) => d.ticketSlugs);
    const tickets = await this.prisma.ticket.findMany({
      where: { slug: { in: [...new Set(slugs)] } },
      select: { id: true, name: true, slug: true },
    });
    const ticketBySlug = new Map(tickets.map((t) => [t.slug, t]));

    const now = new Date();
    const data = results.map((d) => ({
      id: d.id,
      type: d.type,
      amount: d.amount.toFixed(2),
      code: d.code,
      usage: d._count.orders,
      validFrom: d.validFrom.toISOString().slice(0, 10),
      validTo: d.validTo?.toISOString().slice(0, 10) ?? null,
      name: d.name,
      limit: d.limit,
      status:
        d.validFrom > now
          ? 'SCHEDULED'
          : d.validTo && d.validTo < now
            ? 'EXPIRED'
            : 'ACTIVE',
      createdAt: d.createdAt,
      tickets: d.ticketSlugs
        .map((slug) => ticketBySlug.get(slug))
        .filter((t): t is { id: string; name: string; slug: string } =>
          Boolean(t),
        )
        .map(({ id, name }) => ({ id, name })),
    }));

    return {
      data,
      meta: {
        nextCursor: hasMore ? (data[data.length - 1]?.id ?? null) : null,
        prevCursor: cursor ?? null,
        limit,
        hasMore,
      },
    };
  }
}
