import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { MailModule } from '../mail/mail.module';
import { PaymentsModule } from '../payment/payment.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AttendeeController],
  providers: [AttendeeService, PrismaService],
  exports: [AttendeeService],
  imports: [MailModule, PaymentsModule],
})
export class AttendeeModule {}
