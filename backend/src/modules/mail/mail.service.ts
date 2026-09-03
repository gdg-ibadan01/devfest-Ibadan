import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { adminInviteTemplate } from './templates/admin-invite.template';
import { eventReminderTemplate } from './templates/event-reminder.template';
import { paymentFailedTemplate } from './templates/payment-failure.templare';
import { ticketConfirmationTemplate } from './templates/ticket-confirmation.template';
import { paymentSuccessTemplate } from './templates/payment-success.template';
import { paymentLinkTemplate } from './templates/payment-link.template';
import { passwordResetTemplate } from './templates/password-reset.template';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('cpanel.host'),
      port: this.configService.get<number>('cpanel.port'),
      secure: this.configService.get<number>('cpanel.port') === 465,
      auth: {
        user: this.configService.get<string>('cpanel.user'),
        pass: this.configService.get<string>('cpanel.password'),
      },
    });
    this.transporter
      .verify()
      .then(() => {
        this.logger.log('✅ cPanel SMTP connection successful');
      })
      .catch((error) => {
        this.logger.error('❌ cPanel SMTP connection failed:', error.message);
      });
  }

  async onModuleInit() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ cPanel SMTP connection successful');
    } catch (error) {
      this.logger.error(
        `❌ cPanel SMTP connection failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  async onModuleInit() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ cPanel SMTP connection successful');
    } catch (error) {
      this.logger.error(
        `❌ cPanel SMTP connection failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  async sendTicketConfirmationEmail(
    email: string,
    fullName: string,
    ticketType: string,
    transactionId: string,
    ticketNumber: string,
    isCheckedIn: boolean,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('cpanel.from.email') ??
      'noreply@gdgibadan.com';

    const html = ticketConfirmationTemplate(
      fullName,
      ticketType,
      transactionId,
      ticketNumber,
      isCheckedIn,
      supportEmail,
      logoUrl,
    );

    return this.transporter.sendMail({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Ticket Confirmed - DevFest Ibadan 2025',
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
      this.configService.get<string>('cpanel.from.email') ??
      'noreply@gdgibadan.com';

    const html = paymentSuccessTemplate(
      fullName,
      amount,
      ticketUrl,
      supportEmail,
      logoUrl,
    );

    return this.transporter.sendMail({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Payment Successful - DevFest Ibadan 2025',
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
      this.configService.get<string>('cpanel.from.email') ??
      'noreply@gdgibadan.com';

    const html = paymentFailedTemplate(
      fullName,
      retryLink,
      supportEmail,
      logoUrl,
    );

    return this.transporter.sendMail({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Payment Failed - DevFest Ibadan 2025',
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
      this.configService.get<string>('cpanel.from.email') ??
      'noreply@gdgibadan.com';

    await this.transporter.sendMail({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Event Reminder - DevFest Ibadan 2025',
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

  async sendInviteEmail(email: string, fullName: string) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    await this.transporter.sendMail({
      from: `"GDG Event Manager" <${this.configService.get<string>('cpanel.from.email')}>`,
      to: email,
      subject: 'You are invited as an Admin',
      html: adminInviteTemplate(fullName, logoUrl),
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
      this.configService.get<string>('cpanel.from.email') ??
      'noreply@gdgibadan.com';

    const info = await this.transporter.sendMail({
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
      this.configService.get<string>('cpanel.from.email') ??
      'noreply@gdgibadan.com';

    await this.transporter.sendMail({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: 'Password Reset Request - GDG Ibadan Admin',
      html: passwordResetTemplate(fullName, resetLink, supportEmail, logoUrl),
    });
  }
}
