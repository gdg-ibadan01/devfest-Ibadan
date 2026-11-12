import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlatpayService } from '../payment/alatpay.service';
import { PaymentConfirmationService } from './payment-confirmation.service';

const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
const LOOKBACK_MS = 2 * 60 * 60 * 1000;

/**
 * Safety net for lost ALATPay callbacks (retries are not documented): every
 * few minutes, lists recent completed ALATPay transactions and confirms any
 * that belong to orders still awaiting payment.
 *
 * Runs only when ALATPAY_RECONCILIATION_ENABLED=true.
 */
@Injectable()
export class AlatpayReconciliationSweeper
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(AlatpayReconciliationSweeper.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly alatpay: AlatpayService,
    private readonly confirmation: PaymentConfirmationService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    if (!this.alatpay.reconciliationEnabled || !this.alatpay.isConfigured()) {
      return;
    }
    this.logger.log('ALATPay reconciliation enabled');
    this.timer = setInterval(() => void this.tick(), SWEEP_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async tick() {
    if (this.running) return;
    this.running = true;
    try {
      const since = new Date(Date.now() - LOOKBACK_MS);
      const pending = await this.prisma.order.findMany({
        where: {
          paymentProvider: 'ALATPAY',
          status: OrderStatus.AWAITING_PAYMENT,
          createdAt: { gte: since },
          amount: { gt: 0 },
        },
        select: { id: true },
        take: 500,
      });
      if (pending.length === 0) return;

      const pendingIds = new Set(pending.map((o) => o.id));
      const transactions = await this.alatpay.listTransactions(
        since,
        new Date(),
      );

      let confirmed = 0;
      for (const tx of transactions) {
        if (
          tx.status !== 'COMPLETED' ||
          !tx.orderId ||
          !pendingIds.has(tx.orderId)
        ) {
          continue;
        }
        try {
          const result = await this.confirmation.confirm({
            provider: 'ALATPAY',
            transactionRef: tx.transactionRef,
            source: 'SWEEPER',
          });
          if (result.outcome === 'PROCESSED') confirmed++;
        } catch (err) {
          this.logger.warn(
            `Reconciliation of ${tx.transactionRef} failed: ${(err as Error).message}`,
          );
        }
      }
      if (confirmed > 0) {
        this.logger.log(
          `Reconciliation confirmed ${confirmed} ALATPay payment(s)`,
        );
      }
    } catch (err) {
      this.logger.error(
        `ALATPay reconciliation failed: ${(err as Error).message}`,
      );
    } finally {
      this.running = false;
    }
  }
}
