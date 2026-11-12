import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentsModule } from '../payment/payment.module';
import { OrdersModule } from '../order/order.module';
import { CheckoutController } from './checkout.controller';
import { PaymentConfirmationService } from './payment-confirmation.service';
import { AlatpayReconciliationSweeper } from './alatpay-reconciliation.sweeper';
import { IpRateLimitGuard } from './ip-rate-limit.guard';

@Module({
  imports: [PaymentsModule, OrdersModule],
  controllers: [CheckoutController],
  providers: [
    PrismaService,
    PaymentConfirmationService,
    AlatpayReconciliationSweeper,
    IpRateLimitGuard,
  ],
  exports: [PaymentConfirmationService],
})
export class CheckoutModule {}
