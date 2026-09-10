import { Injectable } from '@nestjs/common';
import { render, type FontLoader } from 'takumi-pdf';
import { readFile } from 'node:fs/promises';
import { join } from 'path';
import * as QRCode from 'qrcode';
import { DevFest2026Ticket } from './templates/devfest-2026-ticket';

interface DevFest2026TicketParams {
  downloadUrl: string;
  ticketCode: string;
  validity: string[];
  amount: number;
}

@Injectable()
export class PDFService {
  async generateDevFest2026Ticket(payload: DevFest2026TicketParams) {
    try {
      const fontsDir = join(__dirname, 'fonts');
      const fonts: FontLoader[] = [
        {
          name: 'GoogleSans',
          subsetOf: 'Google Sans',
          weight: 400,
          style: 'normal' as const,
          generic: 'sans-serif' as const,
          data: () => readFile(join(fontsDir, 'GoogleSans-Regular.ttf')),
        },
        {
          name: 'GoogleSans',
          subsetOf: 'Google Sans',
          weight: 500,
          style: 'normal' as const,
          generic: 'sans-serif' as const,
          data: () => readFile(join(fontsDir, 'GoogleSans-Medium.ttf')),
        },
        {
          name: 'GoogleSans',
          subsetOf: 'Google Sans',
          weight: 700,
          style: 'normal' as const,
          generic: 'sans-serif' as const,
          data: () => readFile(join(fontsDir, 'GoogleSans-Bold.ttf')),
        },
      ];

      const qrCodeBase64 = await QRCode.toDataURL(payload.downloadUrl, {
        margin: 1,
      });
      const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      });

      const pdf = await render(
        DevFest2026Ticket({
          qrCodeBase64,
          amount: formatter.format(payload.amount).replace('₦', 'NGN '),
          ticketCode: payload.ticketCode,
          validity: payload.validity.join(' & '),
        }),
        {
          size: 'a4',
          fonts,
        },
      );

      return Buffer.from(pdf);
    } catch (err) {
      console.error(err);
    }
  }
}
