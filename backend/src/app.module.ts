import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { winstonConfig } from './config/logger/wiston.config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { ValidationPipe422 } from './common/pipe/validation.pipe';
import { RequestLoggerInterceptor } from './common/interceptor/request-logger.interceptor';
import { AppService } from './app.service';
import { AttendeeModule } from './modules/attendee/attendee.module';
import { EventsModule } from './modules/events/events.module';
import { MailModule } from './modules/mail/mail.module';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentsModule } from './modules/payment/payment.module';
import { databaseConfig } from './config/database.config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import gmailConfig from './config/mail.config';
import paystackConfig from './config/paystack.config';
import cloudinaryConfig from './config/cloudinary.config';
import superadminConfig from './config/superadmin.config';
import monnifyConfig from './config/monnify.config';
import { TicketsModule } from './modules/ticket/ticket.module';
import { UploadModule } from './modules/upload/upload.module';
import { OrdersModule } from './modules/order/order.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { PDFService } from './modules/pdf/pdf.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        jwtConfig,
        gmailConfig,
        cloudinaryConfig,
        paystackConfig,
        superadminConfig,
        monnifyConfig,
      ],
    }),
    // Logging
    WinstonModule.forRootAsync(winstonConfig),
    AttendeeModule,
    EventsModule,
    MailModule,
    AdminModule,
    PaymentsModule,
    TicketsModule,
    UploadModule,
    OrdersModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe422,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
    AppService,
    PDFService,
  ],
})
export class AppModule {}
