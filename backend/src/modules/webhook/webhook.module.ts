import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PaymentsModule } from '../payment/payment.module';
import { OrdersModule } from '../order/order.module';

@Module({
  imports: [PaymentsModule, OrdersModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
