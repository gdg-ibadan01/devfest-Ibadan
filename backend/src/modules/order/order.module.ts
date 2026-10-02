import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { DiscountsController } from './discount.controller';
import { DiscountsService } from './discount.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { PaymentsModule } from '../payment/payment.module';
import { TicketsModule } from '../ticket/ticket.module';

@Module({
  imports: [MailModule, PaymentsModule, TicketsModule],
  controllers: [OrdersController, DiscountsController],
  providers: [OrdersService, DiscountsService, PrismaService],
  exports: [OrdersService, DiscountsService],
})
export class OrdersModule {}
