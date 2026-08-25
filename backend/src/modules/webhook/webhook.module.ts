import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentsModule } from '../payment/payment.module';

@Module({
  imports: [PaymentsModule],
  controllers: [WebhookController],
  providers: [WebhookService, PrismaService],
})
export class WebhookModule {}
