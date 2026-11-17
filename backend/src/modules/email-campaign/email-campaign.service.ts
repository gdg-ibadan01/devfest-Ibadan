import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  EmailCampaignStatus,
  EmailSendStatus,
  OrderStatus,
  Prisma,
} from '@prisma/client';
import AppConfig from 'src/config/app.config';
import { buildSignedTicketDownloadUrl } from 'src/common/utils/ticket-download-url';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import {
  CampaignAudienceDto,
  CreateEmailCampaignDto,
  DeliveriesQueryDto,
  UpdateEmailCampaignDto,
} from './dto/email-campaign.dto';
import { normalizeMessageId } from '../mail/message-id';
import { CampaignTokens, renderCampaignEmail } from './campaign-email.template';

/** A delivery that hits a provider rate limit is retried this many times before failing. */
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_PAUSE_MS = 5 * 60 * 1000;
const NO_BUDGET_PAUSE_MS = 60 * 1000;
const BATCH_SIZE = 10;

const RATE_LIMIT_PATTERN = /rate|limit|quota|too many|429|throttl/i;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms).unref());

@Injectable()
export class EmailCampaignService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EmailCampaignService.name);
  /** Campaign ids whose send loop is running in this process. */
  private readonly running = new Set<string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  /** Resume campaigns that were mid-send when the server stopped. */
  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'test') return;
    const sending = await this.prisma.emailCampaign.findMany({
      where: { status: EmailCampaignStatus.SENDING },
      select: { id: true },
    });
    for (const { id } of sending) this.kick(id);
  }

  // ---- audience -------------------------------------------------------

  private audienceWhere(
    audience?: CampaignAudienceDto,
  ): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = { status: OrderStatus.PAID };
    const and: Prisma.OrderWhereInput[] = [];
    if (audience?.ticketId) where.ticketId = audience.ticketId;
    if (audience?.checkedIn === true) where.checkIns = { isEmpty: false };
    if (audience?.checkedIn === false) where.checkIns = { isEmpty: true };
    if (audience?.ticketEmailNotConfirmed) {
      and.push({
        OR: [
          { ticketEmailStatus: null },
          { ticketEmailStatus: { not: EmailSendStatus.SENT } },
        ],
      });
    }
    if (and.length) where.AND = and;
    return where;
  }

  /** Paid (and free) ticket holders matching the filter, one per email address. */
  private async resolveAudience(audience?: CampaignAudienceDto) {
    const orders = await this.prisma.order.findMany({
      where: this.audienceWhere(audience),
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        reference: true,
        attendeeEmail: true,
        attendeeFullName: true,
      },
    });
    const seen = new Set<string>();
    return orders.filter((o) => {
      const key = o.attendeeEmail.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async audienceCount(audience?: CampaignAudienceDto) {
    return { count: (await this.resolveAudience(audience)).length };
  }

  // ---- drafts ---------------------------------------------------------

  private async findOrThrow(id: string) {
    const campaign = await this.prisma.emailCampaign.findUnique({
      where: { id },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  private assertDraft(status: EmailCampaignStatus) {
    if (status !== EmailCampaignStatus.DRAFT) {
      throw new BadRequestException('Only drafts can be changed or deleted');
    }
  }

  create(dto: CreateEmailCampaignDto, adminId: string) {
    return this.prisma.emailCampaign.create({
      data: {
        subject: dto.subject.trim(),
        preheader: dto.preheader?.trim() ?? '',
        body: dto.body,
        audience: (dto.audience ?? {}) as Prisma.InputJsonValue,
        createdById: adminId,
      },
    });
  }

  async update(id: string, dto: UpdateEmailCampaignDto) {
    const campaign = await this.findOrThrow(id);
    this.assertDraft(campaign.status);
    return this.prisma.emailCampaign.update({
      where: { id },
      data: {
        ...(dto.subject !== undefined && { subject: dto.subject.trim() }),
        ...(dto.preheader !== undefined && { preheader: dto.preheader.trim() }),
        ...(dto.body !== undefined && { body: dto.body }),
        ...(dto.audience !== undefined && {
          audience: dto.audience as Prisma.InputJsonValue,
        }),
      },
    });
  }

  async remove(id: string) {
    const campaign = await this.findOrThrow(id);
    this.assertDraft(campaign.status);
    await this.prisma.emailCampaign.delete({ where: { id } });
    return { deleted: true };
  }

  // ---- reading --------------------------------------------------------

  private async stats(campaignId: string) {
    const rows = await this.prisma.emailDelivery.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: { _all: true },
    });
    const count = (s: EmailSendStatus) =>
      rows.find((r) => r.status === s)?._count._all ?? 0;
    const sent = count(EmailSendStatus.SENT);
    const failed = count(EmailSendStatus.FAILED);
    const pending = count(EmailSendStatus.PENDING);
    return { total: sent + failed + pending, sent, failed, pending };
  }

  async list() {
    const campaigns = await this.prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { createdBy: { select: { fullName: true } } },
    });
    return Promise.all(
      campaigns.map(async (c) => ({
        ...c,
        createdByName: c.createdBy.fullName,
        createdBy: undefined,
        stats: await this.stats(c.id),
      })),
    );
  }

  async get(id: string) {
    const campaign = await this.findOrThrow(id);
    return { ...campaign, stats: await this.stats(id) };
  }

  async deliveries(id: string, query: DeliveriesQueryDto) {
    await this.findOrThrow(id);
    const { status, page = 1, limit = 20 } = query;
    const where: Prisma.EmailDeliveryWhereInput = {
      campaignId: id,
      ...(status && { status }),
    };
    const [data, total] = await Promise.all([
      this.prisma.emailDelivery.findMany({
        where,
        orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          status: true,
          error: true,
          attempts: true,
          sentAt: true,
          event: true,
          eventDetail: true,
        },
      }),
      this.prisma.emailDelivery.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ---- rendering ------------------------------------------------------

  private render(
    campaign: { subject: string; preheader: string; body: string },
    person: { fullName: string; reference: string },
  ) {
    const fullName = person.fullName.trim();
    const tokens: CampaignTokens = {
      first_name: fullName.split(/\s+/)[0] ?? '',
      full_name: fullName,
      ticket_code: person.reference.slice(-6),
      ticket_link: buildSignedTicketDownloadUrl(
        person.reference,
        this.appConfig.ticketJWTSecret,
        this.appConfig.url,
      ),
    };
    return renderCampaignEmail({
      subject: campaign.subject,
      preheader: campaign.preheader,
      body: campaign.body,
      tokens,
      logoUrl: this.appConfig.logoUrl,
      headerUrl: this.appConfig.emailHeaderUrl,
      supportEmail: this.mailService.supportEmail(),
    });
  }

  /** Renders unsaved content with sample values, for the composer's live preview. */
  preview(dto: { subject: string; preheader?: string; body: string }) {
    const { html, subject } = this.render(
      { subject: dto.subject, preheader: dto.preheader ?? '', body: dto.body },
      { fullName: 'Ada Obi', reference: 'SAMPLEREF-ABC123' },
    );
    return { html, subject };
  }

  // ---- test + send ----------------------------------------------------

  /**
   * Sends the draft, as a "[Test]" email with sample values, to the given
   * addresses (default: the admin's own). Nothing is queued and no campaign
   * delivery is recorded. Each address gets its own result, so one bad
   * address doesn't stop the others.
   */
  async sendTest(id: string, adminId: string, emails?: string[]) {
    const campaign = await this.findOrThrow(id);
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: { email: true },
    });
    if (!admin) throw new NotFoundException('Admin not found');

    const seen = new Set<string>();
    const recipients = (emails?.length ? emails : [admin.email])
      .map((e) => e.trim())
      .filter((e) => {
        const key = e.toLowerCase();
        if (!e || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    // Same sample person as the live preview, so the test matches what the
    // composer showed. The ticket link in a test is a placeholder.
    const { html, text, subject } = this.render(campaign, {
      fullName: 'Ada Obi',
      reference: 'SAMPLEREF-ABC123',
    });

    const sent: string[] = [];
    const failed: { email: string; error: string }[] = [];
    for (const to of recipients) {
      try {
        await this.mailService.sendCustomEmail({
          to,
          subject: `[Test] ${subject}`,
          html,
          text,
        });
        sent.push(to);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Test email to ${to} failed: ${message}`);
        failed.push({ email: to, error: message.slice(0, 200) });
      }
    }

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'SEND_TEST_EMAIL',
        metadata: { campaignId: id, sent: sent.length, failed: failed.length },
      },
    });
    return { sent, failed };
  }

  async send(id: string, adminId: string) {
    const campaign = await this.findOrThrow(id);
    this.assertDraft(campaign.status);

    const recipients = await this.resolveAudience(
      campaign.audience as CampaignAudienceDto,
    );
    if (recipients.length === 0) {
      throw new BadRequestException('No ticket holders match this audience');
    }

    await this.prisma.$transaction([
      this.prisma.emailDelivery.createMany({
        data: recipients.map((r) => ({
          campaignId: id,
          orderId: r.id,
          email: r.attendeeEmail.trim(),
          fullName: r.attendeeFullName,
        })),
        skipDuplicates: true,
      }),
      this.prisma.emailCampaign.update({
        where: { id },
        data: { status: EmailCampaignStatus.SENDING },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'SEND_EMAIL_CAMPAIGN',
          metadata: { campaignId: id, recipients: recipients.length },
        },
      }),
    ]);

    this.kick(id);
    return { queued: recipients.length };
  }

  async retryFailed(id: string, adminId: string) {
    const campaign = await this.findOrThrow(id);
    if (campaign.status === EmailCampaignStatus.DRAFT) {
      throw new BadRequestException('This campaign has not been sent yet');
    }
    const reset = await this.prisma.emailDelivery.updateMany({
      where: { campaignId: id, status: EmailSendStatus.FAILED },
      data: { status: EmailSendStatus.PENDING, error: null, attempts: 0 },
    });
    if (reset.count === 0) return { requeued: 0 };

    await this.prisma.emailCampaign.update({
      where: { id },
      data: { status: EmailCampaignStatus.SENDING },
    });
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'RETRY_EMAIL_CAMPAIGN',
        metadata: { campaignId: id, requeued: reset.count },
      },
    });
    this.kick(id);
    return { requeued: reset.count };
  }

  // ---- worker ---------------------------------------------------------

  private kick(id: string) {
    if (this.running.has(id)) return;
    this.running.add(id);
    void this.process(id)
      .catch((err: Error) =>
        this.logger.error(`Campaign ${id} send loop crashed: ${err.message}`),
      )
      .finally(() => this.running.delete(id));
  }

  /**
   * Sends PENDING deliveries in small batches, never past the mail budget
   * (MAIL_MAX_PER_HOUR / MAIL_MAX_PER_DAY). With a daily cap this loop simply
   * waits for room, so a large campaign finishes over several days. Progress
   * is stored per delivery, so a restart resumes where it stopped.
   */
  private async process(id: string) {
    while (true) {
      const campaign = await this.prisma.emailCampaign.findUnique({
        where: { id },
      });
      if (!campaign || campaign.status !== EmailCampaignStatus.SENDING) return;

      const budget = this.mailService.remainingBudget();
      if (budget <= 0) {
        await sleep(NO_BUDGET_PAUSE_MS);
        continue;
      }

      const batch = await this.prisma.emailDelivery.findMany({
        where: { campaignId: id, status: EmailSendStatus.PENDING },
        orderBy: { createdAt: 'asc' },
        take: Math.min(BATCH_SIZE, budget),
        include: { order: { select: { reference: true } } },
      });

      if (batch.length === 0) {
        await this.finish(id);
        return;
      }

      let rateLimited = false;
      for (const delivery of batch) {
        const { html, text, subject } = this.render(campaign, {
          fullName: delivery.fullName,
          reference: delivery.order.reference,
        });
        try {
          const info = (await this.mailService.sendCustomEmail({
            to: delivery.email,
            subject,
            html,
            text,
          })) as { messageId?: string };
          await this.prisma.emailDelivery.update({
            where: { id: delivery.id },
            data: {
              status: EmailSendStatus.SENT,
              sentAt: new Date(),
              error: null,
              attempts: { increment: 1 },
              messageId: normalizeMessageId(info.messageId),
              event: null,
              eventAt: null,
              eventDetail: null,
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const limited = RATE_LIMIT_PATTERN.test(message);
          const attempts = delivery.attempts + 1;
          await this.prisma.emailDelivery.update({
            where: { id: delivery.id },
            data: {
              attempts,
              error: message.slice(0, 500),
              // A rate-limit rejection is not the recipient's fault: try again later.
              status:
                limited && attempts < MAX_ATTEMPTS
                  ? EmailSendStatus.PENDING
                  : EmailSendStatus.FAILED,
            },
          });
          this.logger.warn(
            `Campaign ${id}: send to ${delivery.email} failed: ${message}`,
          );
          if (limited) {
            rateLimited = true;
            break;
          }
        }
      }

      if (rateLimited) await sleep(RATE_LIMIT_PAUSE_MS);
    }
  }

  private async finish(id: string) {
    const { sent, failed } = await this.stats(id);
    const status =
      failed === 0
        ? EmailCampaignStatus.SENT
        : sent === 0
          ? EmailCampaignStatus.FAILED
          : EmailCampaignStatus.PARTIAL;
    await this.prisma.emailCampaign.update({
      where: { id },
      data: { status, sentAt: new Date() },
    });
    this.logger.log(
      `Campaign ${id} finished: ${sent} sent, ${failed} failed (${status})`,
    );
  }
}
