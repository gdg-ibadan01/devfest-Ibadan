import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OrdersService } from './order.service';

const SWEEP_INTERVAL_MS = 2 * 60 * 1000;

/**
 * Every couple of minutes, retries ticket emails that never went out (stuck
 * PENDING after a restart or deferred by the mail limit, or FAILED). Runs in
 * the API process, so it needs no queue or extra service.
 */
@Injectable()
export class TicketEmailSweeper implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TicketEmailSweeper.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(private readonly orders: OrdersService) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    this.timer = setInterval(() => void this.tick(), SWEEP_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  /** Exposed for tests; skips if the previous round is still running. */
  async tick() {
    if (this.running) return;
    this.running = true;
    try {
      await this.orders.retryUnconfirmedTicketEmails();
    } catch (err) {
      this.logger.error(`Ticket email retry failed: ${(err as Error).message}`);
    } finally {
      this.running = false;
    }
  }
}
