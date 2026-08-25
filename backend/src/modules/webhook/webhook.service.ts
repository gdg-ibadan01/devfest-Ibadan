import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonnifyService } from '../payment/monnify.service';
import {
  MonnifyWebhookEvent,
  MonnifyWebhookEventData,
} from '../payment/interfaces/monnify.interface';
import monnifyConfig from 'src/config/monnify.config';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly monnifyService: MonnifyService,
    @Inject(monnifyConfig.KEY)
    private readonly mnfyCfg: ConfigType<typeof monnifyConfig>,
  ) {}

  async handleMonnifyEvent(
    body: Record<string, unknown>,
    signature: string | undefined,
  ): Promise<void> {
    if (this.mnfyCfg.shouldVerifySignature && signature) {
      const isValid = this.monnifyService.verifyWebhookSignature(
        JSON.stringify(body),
        signature,
      );
      if (!isValid) {
        this.logger.warn('Invalid Monnify webhook signature');
        return;
      }
    }

    const event = body as unknown as MonnifyWebhookEvent;
    const { eventType, eventData } = event;

    if (!eventType || !eventData) {
      this.logger.warn('Monnify webhook missing eventType or eventData');
      return;
    }

    const existing = await this.prisma.webhookEvent.findFirst({
      where: {
        provider: 'MONNIFY',
        eventType,
        paymentReference: eventData.paymentReference,
      },
    });

    if (existing?.processed) {
      this.logger.log(
        `Duplicate Monnify webhook ignored: ${eventType} for ${eventData.paymentReference}`,
      );
      return;
    }

    const webhookEventId =
      existing?.id ||
      (await this.createWebhookEvent(eventType, eventData, body)).id;

    try {
      switch (eventType) {
        case 'SUCCESSFUL_TRANSACTION':
          await this.handleSuccessfulTransaction(eventData);
          break;
        default:
          this.logger.log(`Unhandled Monnify event type: ${eventType}`);
          break;
      }

      await this.prisma.webhookEvent.update({
        where: { id: webhookEventId },
        data: { processed: true },
      });
    } catch (err) {
      this.logger.error(
        `Error processing Monnify webhook ${eventType} for ${eventData.paymentReference}: ${(err as Error).message}`,
      );
    }
  }

  private async createWebhookEvent(
    eventType: string,
    eventData: MonnifyWebhookEventData,
    body: Record<string, unknown>,
  ) {
    return await this.prisma.webhookEvent.create({
      data: {
        provider: 'MONNIFY',
        eventType,
        paymentReference: eventData.paymentReference,
        transactionReference: eventData.transactionReference,
        payload: body as never,
      },
    });
  }

  private async handleSuccessfulTransaction(
    eventData: MonnifyWebhookEventData,
  ): Promise<void> {
    const order = await this.prisma.order.findFirst({
      where: { reference: eventData.paymentReference },
    });

    if (!order) {
      this.logger.error(
        `Order not found for paymentReference: ${eventData.paymentReference}`,
      );
      return;
    }

    if (order.status === OrderStatus.PAID) return;

    this.logger.log(
      `Order ${order.id} status is ${order.status}, status update pending`,
    );
  }
}
