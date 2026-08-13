import { registerAs } from '@nestjs/config';

export default registerAs('superadamin', () => ({
  email: process.env.SUPERADMIN_EMAIL,
  password: process.env.SUPERADMIN_PASSWORD,
}));
