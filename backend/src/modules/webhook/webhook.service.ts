import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MonnifyService } from '../payment/monnify.service';
import {
  MonnifyWebhookEvent,
  MonnifyRejectedPaymentWebhookEventData,
} from '../payment/interfaces/monnify.interface';
import monnifyConfig from 'src/config/monnify.config';
import { OrdersService } from '../order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';

type TxClient = Prisma.TransactionClient;

interface CreateWebhookRecord {
  eventType: string;
  payload: string;
  provider: string;
  paymentReference: string;
  transactionReference: string;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly monnifyService: MonnifyService,
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService,
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

    const existingEvent = await this.prisma.$transaction(async (tx) => {
      return await this.recordEvent(tx, {
        eventType,
        payload: JSON.stringify(eventData),
        paymentReference: eventData.paymentReference,
        transactionReference: eventData.transactionReference,
        provider: 'MONNIFY',
      });
    });

    if (!existingEvent) {
      this.logger.error(
        'Failed to save webhook event to the database. Ignoring event',
      );
      throw new InternalServerErrorException('Cound not record event. Retry');
    }

    if (existingEvent.processed) {
      this.logger.log(
        `Duplicate webhook ignored: ${eventData.paymentReference}`,
      );
      return;
    }

    switch (eventType) {
      case 'SUCCESSFUL_TRANSACTION':
        await this.ordersService.handlePaymentSuccess({
          webhookEventId: existingEvent.id,
          amountPaid: Number(eventData.settlementAmount),
          currency: eventData.currency,
          metaData: eventData.metaData,
          paidOn: eventData.paidOn,
          paymentDescription: eventData.paymentDescription,
          paymentReference: eventData.paymentReference,
          paymentStatus: eventData.paymentStatus,
          provider: 'MONNIFY',
          transactionReference: eventData.transactionReference,
        });
        break;
      // TODO: handle FAILED_REFUND
      // TODO: handle SUCCESSFUL_REFUND
      case 'REJECTED_PAYMENT':
        await this.ordersService.handleFailedPayment({
          webhookEventId: existingEvent.id,
          event: eventData as unknown as MonnifyRejectedPaymentWebhookEventData,
        });
        break;
      default:
        this.logger.log(`Unhandled Monnify event type: ${eventType}`);
        break;
    }
  }

  private async recordEvent(tx: TxClient, ev: CreateWebhookRecord) {
    try {
      return await tx.webhookEvent.create({
        data: {
          eventType: ev.eventType,
          payload: ev.payload,
          provider: ev.provider,
          processed: false,
          paymentReference: ev.paymentReference,
          transactionReference: ev.transactionReference,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === PrismaErrors.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return await this.prisma.webhookEvent.findFirst({
          where: {
            provider: 'MONNIFY',
            eventType: ev.eventType,
            paymentReference: ev.paymentReference,
          },
        });
      }
      throw err;
    }
  }
}
