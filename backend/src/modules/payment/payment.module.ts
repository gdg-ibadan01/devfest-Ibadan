import { Module } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { MailModule } from '../mail/mail.module';
import { PaymentsController } from './payment.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [MailModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
