import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { MailModule } from '../mail/mail.module';
import { PaymentsModule } from '../payment/payment.module';

@Module({
  controllers: [AttendeeController],
  providers: [AttendeeService],
  exports: [AttendeeService],
  imports: [MailModule, PaymentsModule],
})
export class AttendeeModule {}
