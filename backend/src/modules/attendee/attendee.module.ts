import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersModule } from '../order/order.module';
import { MailModule } from '../mail/mail.module';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';

@Module({
  imports: [OrdersModule, MailModule],
  controllers: [AttendeeController],
  providers: [AttendeeService, PrismaService],
  exports: [AttendeeService],
})
export class AttendeeModule {}
