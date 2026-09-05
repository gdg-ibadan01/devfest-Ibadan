import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  BadRequestException,
  ConsoleLogger,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { apiReference } from '@scalar/nestjs-api-reference';
// import { TransformerInterceptor } from './common/interceptor/transformer.interceptor';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: new ConsoleLogger({
      prefix: 'GDGIbadan',
    }),
  });

  const configService = app.get(ConfigService);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, 'https:', `'unsafe-inline'`],
        },
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  logger.log('CORS enabled');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.error('Validation errors:', errors);
        return new BadRequestException('Validation failed');
      },
    }),
  );
  logger.log('Global validation pipe applied');

  // app.useGlobalInterceptors(new TransformerInterceptor());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('GDG Ibadan Ticketing System')
    .setDescription('Ticketing application API for GDG Ibadan events')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);
  app.use('/api/docs', apiReference({ content: document }));

  // Load environment variables
  const port = configService.get<number>('PORT') || 3000;
  const appUrl =
    configService.get<string>('APP_URL') || `http://localhost:${port}`;

  await app.listen(port);
  logger.log(`🚀 Application is running on:${appUrl}`);
  logger.log(`Swagger documentation: ${appUrl}/api/docs`);
  logger.log(`🔧 Environment: ${configService.get('NODE_ENV', 'development')}`);
}
bootstrap();
