import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PaymentsModule } from '../payment/payment.module';
import { OrdersModule } from '../order/order.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { ResendWebhookService } from './resend-webhook.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PaymentsModule, OrdersModule, CheckoutModule],
  controllers: [WebhookController],
  providers: [WebhookService, ResendWebhookService, PrismaService],
})
export class WebhookModule {}
