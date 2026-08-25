import { Module } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { MailModule } from '../mail/mail.module';
import { PaymentsController } from './payment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonnifyService } from './monnify.service';
import { PAYMENT_PROVIDER } from './interfaces/payment-provider.interface';

@Module({
  imports: [MailModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PrismaService,
    MonnifyService,
    { provide: PAYMENT_PROVIDER, useExisting: MonnifyService },
  ],
  exports: [PaymentsService, PAYMENT_PROVIDER],
})
export class PaymentsModule {}
