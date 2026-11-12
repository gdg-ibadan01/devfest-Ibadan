import { Module } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { MailModule } from '../mail/mail.module';
import { PaymentsController } from './payment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonnifyService } from './monnify.service';
import { AlatpayService } from './alatpay.service';
import { PaymentProviderRegistry } from './payment-provider.registry';
import { PAYMENT_PROVIDER } from './interfaces/payment-provider.interface';

@Module({
  imports: [MailModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PrismaService,
    MonnifyService,
    AlatpayService,
    PaymentProviderRegistry,
    // Legacy token: resolves to the provider for new orders.
    {
      provide: PAYMENT_PROVIDER,
      useFactory: (registry: PaymentProviderRegistry) => registry.active(),
      inject: [PaymentProviderRegistry],
    },
  ],
  exports: [
    PaymentsService,
    PAYMENT_PROVIDER,
    MonnifyService,
    AlatpayService,
    PaymentProviderRegistry,
  ],
})
export class PaymentsModule {}
