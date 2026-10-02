import { Module } from '@nestjs/common';
import { PDFService } from './pdf.service';

@Module({
  providers: [PDFService],
  exports: [PDFService],
})
export class PdfModule {}
