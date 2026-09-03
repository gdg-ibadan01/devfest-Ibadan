import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PaymentsModule } from '../payment/payment.module';
import { OrdersModule } from '../order/order.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PaymentsModule, OrdersModule],
  controllers: [WebhookController],
  providers: [WebhookService, PrismaService],
})
export class WebhookModule {}
