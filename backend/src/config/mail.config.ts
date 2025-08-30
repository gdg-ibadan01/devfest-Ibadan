import { registerAs } from '@nestjs/config';

export default registerAs('gmail', () => ({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT ?? '', 10) || 587,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  from: {
    email: process.env.FROM_EMAIL,
    name: process.env.FROM_NAME,
  },
}));
