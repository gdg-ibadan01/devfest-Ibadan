import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MonnifyService } from '../payment/monnify.service';
import { MonnifyWebhookEvent } from '../payment/interfaces/monnify.interface';
import monnifyConfig from 'src/config/monnify.config';
import { OrdersService } from '../order/order.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly monnifyService: MonnifyService,
    private readonly ordersService: OrdersService,
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

    switch (eventType) {
      case 'SUCCESSFUL_TRANSACTION':
        await this.ordersService.handlePaymentSuccess(eventData);
        break;
      // TODO: handle FAILED_TRANSACTION — set order status to CANCELLED
      // TODO: handle FAILED_REFUND
      // TODO: handle SUCCESSFUL_REFUND
      default:
        this.logger.log(`Unhandled Monnify event type: ${eventType}`);
        break;
    }
  }
}
