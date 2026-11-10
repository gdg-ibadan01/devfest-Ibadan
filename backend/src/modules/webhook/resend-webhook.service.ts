import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { normalizeMessageId } from '../mail/message-id';
import {
  EVENT_RANK,
  ParsedEmailEvent,
  SvixHeaders,
  parseEmailEvent,
  verifySvixSignature,
} from './resend-webhook.util';

/** When matching by recipient address only, ignore sends older than this. */
const FALLBACK_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type ResendWebhookResult =
  | { status: 'unauthorized' }
  | { status: 'ignored' }
  | { status: 'unmatched' }
  | { status: 'recorded'; target: 'order' | 'campaign' };

@Injectable()
export class ResendWebhookService {
  private readonly logger = new Logger(ResendWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async handle(
    rawBody: Buffer | string | undefined,
    headers: SvixHeaders,
  ): Promise<ResendWebhookResult> {
    const secret = this.config.get<string>('mail.webhookSecret');
    if (!secret) {
      this.logger.error(
        'RESEND_WEBHOOK_SECRET is not set; rejecting Resend webhook',
      );
      return { status: 'unauthorized' };
    }
    if (!rawBody || !verifySvixSignature(secret, rawBody, headers)) {
      this.logger.warn('Resend webhook rejected: bad signature');
      return { status: 'unauthorized' };
    }

    let payload: unknown;
    try {
      payload = JSON.parse(
        typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'),
      );
    } catch {
      return { status: 'ignored' };
    }
    const event = parseEmailEvent(payload);
    if (!event) return { status: 'ignored' };

    return this.record(event);
  }

  private async record(event: ParsedEmailEvent): Promise<ResendWebhookResult> {
    const messageId = normalizeMessageId(event.messageId);
    const target = await this.findTarget(messageId, event.to);
    if (!target) {
      this.logger.warn(
        `Resend ${event.state} event could not be matched to a send (to: ${event.to.join(', ') || 'unknown'})`,
      );
      return { status: 'unmatched' };
    }

    const data = {
      event: event.state,
      eventAt: event.occurredAt,
      eventDetail: event.detail,
    };
    // Only move forward: DELIVERED never overwrites BOUNCED, and so on.
    const lower = (
      Object.keys(EVENT_RANK) as (keyof typeof EVENT_RANK)[]
    ).filter((s) => EVENT_RANK[s] <= EVENT_RANK[event.state]);
    const canOverwrite = [null, ...lower];

    if (target.kind === 'order') {
      await this.prisma.order.updateMany({
        where: {
          id: target.id,
          OR: canOverwrite.map((s) => ({ ticketEmailEvent: s })),
        },
        data: {
          ticketEmailEvent: data.event,
          ticketEmailEventAt: data.eventAt,
          ticketEmailEventDetail: data.eventDetail,
        },
      });
    } else {
      await this.prisma.emailDelivery.updateMany({
        where: {
          id: target.id,
          OR: canOverwrite.map((s) => ({ event: s })),
        },
        data,
      });
    }
    this.logger.log(
      `Resend ${event.state} recorded for ${target.kind} ${target.id}`,
    );
    return {
      status: 'recorded',
      target: target.kind === 'order' ? 'order' : 'campaign',
    };
  }

  /**
   * Matches by the Message-ID we stored at send time. If the provider reports a
   * different id, falls back to the most recent send to that address.
   */
  private async findTarget(
    messageId: string | null,
    to: string[],
  ): Promise<{ kind: 'order' | 'delivery'; id: string } | null> {
    if (messageId) {
      const order = await this.prisma.order.findFirst({
        where: { ticketEmailMessageId: messageId },
        select: { id: true },
      });
      if (order) return { kind: 'order', id: order.id };
      const delivery = await this.prisma.emailDelivery.findFirst({
        where: { messageId: { in: [messageId, `<${messageId}>`] } },
        select: { id: true },
      });
      if (delivery) return { kind: 'delivery', id: delivery.id };
    }

    const email = to[0]?.trim();
    if (!email) return null;
    const since = new Date(Date.now() - FALLBACK_WINDOW_MS);
    const [order, delivery] = await Promise.all([
      this.prisma.order.findFirst({
        where: {
          attendeeEmail: { equals: email, mode: 'insensitive' },
          ticketEmailSentAt: { gte: since },
        },
        orderBy: { ticketEmailSentAt: 'desc' },
        select: { id: true, ticketEmailSentAt: true },
      }),
      this.prisma.emailDelivery.findFirst({
        where: {
          email: { equals: email, mode: 'insensitive' },
          sentAt: { gte: since },
        },
        orderBy: { sentAt: 'desc' },
        select: { id: true, sentAt: true },
      }),
    ]);
    if (order && delivery) {
      return (order.ticketEmailSentAt?.getTime() ?? 0) >=
        (delivery.sentAt?.getTime() ?? 0)
        ? { kind: 'order', id: order.id }
        : { kind: 'delivery', id: delivery.id };
    }
    if (order) return { kind: 'order', id: order.id };
    if (delivery) return { kind: 'delivery', id: delivery.id };
    return null;
  }
}
