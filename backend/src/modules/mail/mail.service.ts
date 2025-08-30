import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { adminInviteTemplate } from './Templates/admin-invite.template';
import { eventReminderTemplate } from './Templates/event-reminder.template';
import { paymentFailedTemplate } from './Templates/payment-failure.templare';
import { ticketConfirmationTemplate } from './Templates/ticket-confirmation.template';
import { paymentSuccessTemplate } from './Templates/payment-success.template';
import { paymentLinkTemplate } from './Templates/payment-link.template';

@Injectable()
export class MailService {
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
  }

  async sendTicketConfirmationEmail(
    email: string,
    fullName: string,
    // eventTitle: string,
    // eventDate: string,
    // venue: string,
    ticketType: string,
    transactionId: string,
  ) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    const supportEmail =
      this.configService.get<string>('cpanel.from.email') ??
      'noreply@gdgibadan.com';

    const html = ticketConfirmationTemplate(
      fullName,
      // eventDate,
      // venue,
      ticketType,
      transactionId,
      email,
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

  async sendInviteEmail(email: string, fullName: string, tempPassword: string) {
    const logoUrl =
      this.configService.get<string>('app.logoUrl') ??
      'https://example.com/default-logo.png';

    await this.transporter.sendMail({
      from: `"GDG Event Manager" <${this.configService.get<string>('cpanel.from.email')}>`,
      to: email,
      subject: 'You are invited as an Admin',
      html: adminInviteTemplate(fullName, tempPassword, logoUrl),
    });
  }

  async sendPaymentLinkEmail(
    email: string,
    fullName: string,
    paymentUrl: string,
    amount: number,
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
      subject: 'Complete Your Payment - DevFest Ibadan 2025',
      html: paymentLinkTemplate(
        fullName,
        paymentUrl,
        supportEmail,
        logoUrl,
        amount,
      ),
    });
  }
}
