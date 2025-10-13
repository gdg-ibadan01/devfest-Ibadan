import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'GDG Ticketing System',
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
  url: process.env.APP_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  logoUrl: process.env.LOGO_URL || 'https://example.com/default-logo.png',
  frontendUrl: process.env.FRONTEND_SUCCESS_URL || 'http://localhost:3000',
}));
