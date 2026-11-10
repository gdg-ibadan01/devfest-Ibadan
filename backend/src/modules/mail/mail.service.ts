import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { adminInviteTemplate } from './templates/admin-invite.template';
import { eventReminderTemplate } from './templates/event-reminder.template';
import { paymentFailedTemplate } from './templates/payment-failure.templare';
import {
  TicketConfirmationEmailTemplatePayload,
  ticketConfirmationTemplate,
} from './templates/ticket-confirmation.template';
import { paymentSuccessTemplate } from './templates/payment-success.template';
import { paymentLinkTemplate } from './templates/payment-link.template';
import { passwordResetTemplate } from './templates/password-reset.template';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: this.configService.get<number>('mail.port') === 465,
      // Reuse connections and stay under the provider's ~2 requests/second.
      pool: true,
      maxConnections: 2,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 2,
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },
    });
    this.transporter
      .verify()
      .then(() => {
        this.logger.log('✅ SMTP connection successful');
      })
      .catch((error) => {
        this.logger.error('❌ SMTP connection failed:', error.message);
      });
  }

  async onModuleInit() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP connection successful');
    } catch (error) {
      this.logger.error(
        `❌ SMTP connection failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  /** Timestamps of recent sends, used to stay inside the provider's hourly/daily caps. */
  private readonly sentAt: number[] = [];

  /** Sends one message and counts it against the hourly/daily budget. */
  private async deliver(options: nodemailer.SendMailOptions) {
    const info = await this.transporter.sendMail(options);
    this.sentAt.push(Date.now());
    return info;
  }

  /**
   * How many more emails can go out right now without passing the configured
   * MAIL_MAX_PER_HOUR / MAIL_MAX_PER_DAY (Infinity when no cap is set).
   * The window lives in memory, so it resets on restart; the provider still
   * enforces its own limit.
   */
  remainingBudget(): number {
    const HOUR = 60 * 60 * 1000;
    const now = Date.now();
    while (this.sentAt.length && now - this.sentAt[0] > 24 * HOUR) {
      this.sentAt.shift();
    }
    const perHour = this.configService.get<number>('mail.maxPerHour') ?? 0;
    const perDay = this.configService.get<number>('mail.maxPerDay') ?? 0;
    const lastHour = this.sentAt.filter((t) => now - t <= HOUR).length;
    const left = [
      perHour > 0 ? perHour - lastHour : Infinity,
      perDay > 0 ? perDay - this.sentAt.length : Infinity,
    ];
    return Math.max(0, Math.min(...left));
  }

  /** Address used as the sender and shown as the support contact. */
  supportEmail(): string {
    return (
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com'
    );
  }

  /** Sends an admin-composed message (already rendered to HTML) to one recipient. */
  async sendCustomEmail(args: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) {
    const fromEmail =
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com';
    return this.deliver({
      from: `"GDG Ibadan" <${fromEmail}>`,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
    });
  }

  async sendTicketConfirmationEmail(
    payload: Omit<
      TicketConfirmationEmailTemplatePayload,
      'logoUrl' | 'supportEmail'
    >,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com';

    const html = ticketConfirmationTemplate({
      ...payload,
      supportEmail,
      logoUrl,
    });

    return await this.deliver({
      from: `"GDG Ibadan" <${supportEmail}>`,
      to: payload.email,
      subject: 'Ticket Confirmed - DevFest Ibadan 2026',
      html,
    });
  }

  async sendPaymentSuccessEmail(
    email: string,
    fullName: string,
    amount: string,
    ticketUrl: string,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com';

    const html = paymentSuccessTemplate(
      fullName,
      amount,
      ticketUrl,
      supportEmail,
      logoUrl,
    );

    return this.deliver({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Payment Successful - DevFest Ibadan 2026',
      html,
    });
  }

  async sendPaymentFailedEmail(
    email: string,
    fullName: string,
    retryLink: string,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com';

    const html = paymentFailedTemplate(
      fullName,
      retryLink,
      supportEmail,
      logoUrl,
    );

    return this.deliver({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Payment Failed - DevFest Ibadan 2026',
      html,
    });
  }

  async sendReminderEmail(
    email: string,
    fullName: string,
    eventDate: string,
    location: string,
    startTime: string,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com';

    await this.deliver({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Event Reminder - DevFest Ibadan 2026',
      html: eventReminderTemplate(
        fullName,
        eventDate,
        location,
        startTime,
        supportEmail,
        logoUrl,
      ),
    });
  }

  async sendInviteEmail(email: string, fullName: string, tempPassword: string) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    await this.deliver({
      from: `"GDG Event Manager" <${this.configService.get<string>('mail.from.email')}>`,
      to: email,
      subject: 'You are invited as an Admin',
      html: adminInviteTemplate(fullName, logoUrl, tempPassword),
    });
  }

  async sendPaymentLinkEmail(
    email: string,
    fullName: string,
    paymentUrl: string,
    amount: number,
  ): Promise<void> {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com';

    const info = await this.deliver({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Complete Your Payment - DevFest Ibadan 2026',
      html: paymentLinkTemplate(
        fullName,
        paymentUrl,
        supportEmail,
        logoUrl,
        amount,
      ),
    });

    this.logger.log(
      `📨 Payment email accepted by SMTP for ${email}. Message ID: ${info.messageId}`,
    );
  }
  async sendPasswordResetEmail(
    email: string,
    fullName: string,
    resetLink: string,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('mail.from.email') ??
      'noreply@gdgibadan.com';

    await this.deliver({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Password Reset Request - GDG Ibadan Admin',
      html: passwordResetTemplate(fullName, resetLink, supportEmail, logoUrl),
    });
  }
}
