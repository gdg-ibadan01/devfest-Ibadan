import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { PaymentsModule } from '../payment/payment.module';
import { UploadModule } from '../upload/upload.module';
import { UploadService } from '../upload/upload.service';
import { PDFService } from '../pdf/pdf.service';

@Module({
  imports: [MailModule, PaymentsModule, UploadModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, UploadService, PDFService],
  exports: [OrdersService],
})
export class OrdersModule {}
