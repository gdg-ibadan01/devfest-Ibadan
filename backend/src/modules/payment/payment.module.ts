import { Module } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { MailModule } from '../mail/mail.module';
import { PaymentsController } from './payment.controller';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonnifyService } from './monnify.service';
import { AlatpayService } from './alatpay.service';
import { PaymentProviderRegistry } from './payment-provider.registry';

@Module({
  imports: [MailModule],
  controllers: [PaymentsController, PaymentGatewayController],
  providers: [
    PaymentsService,
    PrismaService,
    MonnifyService,
    AlatpayService,
    PaymentProviderRegistry,
  ],
  exports: [
    PaymentsService,
    MonnifyService,
    AlatpayService,
    PaymentProviderRegistry,
  ],
})
export class PaymentsModule {}
