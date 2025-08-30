import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { winstonConfig } from './config/logger/wiston.config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { ValidationPipe422 } from './common/pipe/validation.pipe';
import { TransformerInterceptor } from './common/interceptor/transformer.interceptor';
import { DatabaseModule } from './modules/database/prisma.module';
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
import { TicketsModule } from './modules/ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, jwtConfig, gmailConfig, paystackConfig],
    }),
    // Logging
    WinstonModule.forRootAsync(winstonConfig),
    DatabaseModule,
    AttendeeModule,
    EventsModule,
    MailModule,
    AdminModule,
    PaymentsModule,
    TicketsModule,
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
      useClass: TransformerInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
