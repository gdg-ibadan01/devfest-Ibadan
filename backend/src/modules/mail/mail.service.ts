import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { adminInviteTemplate } from './Templates/admin-invite.template';
import { eventReminderTemplate } from './Templates/event-reminder.template';
import { paymentFailedTemplate } from './Templates/payment-failure.templare';
import { ticketConfirmationTemplate } from './Templates/ticket-confirmation.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: this.configService.get<string>('gmail.host'),
      port: this.configService.get<number>('gmail.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('gmail.user'),
        pass: this.configService.get<string>('gmail.password'),
      },
    });
  }

  async sendTicketConfirmationEmail(
    email: string,
    fullName: string,
    eventTitle: string,
    eventDate: string,
    venue: string,
    ticketType: string,
    transactionId: string,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('gmail.user') ?? 'noreply@example.com';

    const html = ticketConfirmationTemplate(
      fullName,
      eventDate,
      venue,
      ticketType,
      transactionId,
      email,
      logoUrl,
    );

    return this.transporter.sendMail({
      from: `"GDG Event Manager" <${supportEmail}>`,
      to: email,
      subject: `Ticket Confirmed - DevFest Ibadan 2025 ${eventTitle}`,
      html,
    });
  }

  async sendPaymentFailedEmail(
    email: string,
    firstName: string,
    retryLink: string,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('gmail.user') ?? 'noreply@example.com';

    const html = paymentFailedTemplate(
      firstName,
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
      this.configService.get<string>('gmail.user') ?? 'noreply@example.com';

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

  async sendInviteEmail(email: string, fullName: string, tempPassword: string) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    await this.transporter.sendMail({
      from: `"GDG Event Manager" <${this.configService.get<string>('gmail.user')}>`,
      to: email,
      subject: 'You are invited as an Admin',
      html: adminInviteTemplate(fullName, tempPassword, logoUrl),
    });
  }
}
