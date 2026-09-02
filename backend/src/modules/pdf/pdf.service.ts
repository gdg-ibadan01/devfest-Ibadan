import { Injectable } from '@nestjs/common';
import { render } from 'takumi-pdf';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as QRCode from 'qrcode';
import { DevFest2026Ticket } from './templates/devfest-2026-ticket';

interface DevFest2026TicketParams {
  reference: string;
  ticketCode: string;
  validity: string[];
  amount: number;
}

@Injectable()
export class PDFService {
  async generateDevFest2026Ticket(payload: DevFest2026TicketParams) {
    try {
      const fontsDir = join(__dirname, 'fonts');
      const fonts = [
        {
          name: 'GoogleSans',
          subsetOf: 'Google Sans',
          weight: 400,
          style: 'normal',
          generic: 'sans-serif',
          data: () => readFile(join(fontsDir, 'GoogleSans-Regular.ttf')),
        },
        {
          name: 'GoogleSans',
          subsetOf: 'Google Sans',
          weight: 500,
          style: 'normal',
          generic: 'sans-serif',
          data: () => readFile(join(fontsDir, 'GoogleSans-Medium.ttf')),
        },
        {
          name: 'GoogleSans',
          subsetOf: 'Google Sans',
          weight: 700,
          style: 'normal',
          generic: 'sans-serif',
          data: () => readFile(join(fontsDir, 'GoogleSans-Bold.ttf')),
        },
      ];

      const qrCodeBase64 = await QRCode.toDataURL('https://google.com', {
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

      await writeFile('invoice.pdf', pdf);
    } catch (err) {
      console.error(err);
    }
  }
}
