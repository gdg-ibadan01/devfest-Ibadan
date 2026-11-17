import { registerAs } from '@nestjs/config';

/**
 * Outbound mail settings. Works with any SMTP relay. For Resend:
 *   EMAIL_HOST=smtp.resend.com  EMAIL_PORT=465  EMAIL_USER=resend
 *   RESEND_API_KEY=<Resend API key>  (or EMAIL_PASSWORD=<key>)  FROM_EMAIL=<address on the verified domain>
 * MAIL_MAX_PER_HOUR / MAIL_MAX_PER_DAY should match the provider's plan limits
 * (0 = no app-side limit).
 */
export default registerAs('mail', () => ({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  user: process.env.EMAIL_USER,
  // Resend's SMTP password is the API key, so RESEND_API_KEY wins when set.
  password: process.env.RESEND_API_KEY || process.env.EMAIL_PASSWORD,
  from: {
    email: process.env.FROM_EMAIL,
    name: process.env.FROM_NAME,
  },
  // Signing secret (whsec_...) of the Resend webhook, for delivery/bounce events.
  webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
  maxPerHour: Number(process.env.MAIL_MAX_PER_HOUR) || 0,
  maxPerDay: Number(process.env.MAIL_MAX_PER_DAY) || 0,
}));
