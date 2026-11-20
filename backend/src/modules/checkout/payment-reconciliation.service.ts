import { Injectable, Logger } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlatpayService } from '../payment/alatpay.service';
import { PaymentConfirmationService } from './payment-confirmation.service';

export interface ReconciliationItem {
  transactionRef: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  issue: 'ORDER_NOT_PAID' | 'ORDER_NOT_FOUND';
  order: {
    id: string;
    reference: string;
    status: OrderStatus;
    attendeeFullName: string;
    attendeeEmail: string;
    ticketName: string;
    amount: string;
    createdAt: Date;
  } | null;
}

/**
 * "I paid but I have no ticket": completed ALATPay transactions whose order
 * is not PAID on our side (lost webhook, popup closed early, order expired
 * while paying). The automatic sweeper only covers AWAITING_PAYMENT orders
 * from the last 2 hours; this view covers any status and a wider window.
 */
@Injectable()
export class PaymentReconciliationService {
  private readonly logger = new Logger(PaymentReconciliationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alatpay: AlatpayService,
    private readonly confirmation: PaymentConfirmationService,
  ) {}

  async list(hours: number) {
    const until = new Date();
    const since = new Date(until.getTime() - hours * 3_600_000);

    if (!this.alatpay.isConfigured()) {
      return {
        since,
        until,
        gateway: 'ALATPAY' as const,
        configured: false,
        scanned: 0,
        items: [] as ReconciliationItem[],
      };
    }

    const transactions = (
      await this.alatpay.listTransactions(since, until)
    ).filter((tx) => tx.status === 'COMPLETED');

    const ids = transactions.map((t) => t.orderId).filter(Boolean) as string[];
    const refs = transactions
      .map((t) => t.reference)
      .filter(Boolean) as string[];

    const orders =
      ids.length + refs.length === 0
        ? []
        : await this.prisma.order.findMany({
            where: {
              OR: [{ id: { in: ids } }, { reference: { in: refs } }],
            },
            include: { ticket: { select: { name: true } } },
          });
    const byId = new Map(orders.map((o) => [o.id, o]));
    const byRef = new Map(orders.map((o) => [o.reference, o]));

    const items: ReconciliationItem[] = [];
    for (const tx of transactions) {
      const order =
        (tx.orderId && byId.get(tx.orderId)) ||
        (tx.reference && byRef.get(tx.reference)) ||
        null;
      if (order?.status === OrderStatus.PAID) continue;
      items.push({
        transactionRef: tx.transactionRef,
        amount: tx.amount,
        currency: tx.currency,
        paidAt: tx.paidAt,
        issue: order ? 'ORDER_NOT_PAID' : 'ORDER_NOT_FOUND',
        order: order
          ? {
              id: order.id,
              reference: order.reference,
              status: order.status,
              attendeeFullName: order.attendeeFullName,
              attendeeEmail: order.attendeeEmail,
              ticketName: order.ticket.name,
              amount: order.amount.toFixed(2),
              createdAt: order.createdAt,
            }
          : null,
      });
    }

    return {
      since,
      until,
      gateway: 'ALATPAY' as const,
      configured: true,
      scanned: transactions.length,
      items,
    };
  }

  /** Re-verify one transaction with ALATPay and mark its order paid. */
  async confirm(transactionRef: string, adminId: string) {
    const result = await this.confirmation.confirm({
      provider: 'ALATPAY',
      transactionRef,
      source: 'ADMIN',
    });

    await this.prisma.auditLog
      .create({
        data: {
          adminId,
          action: 'RECONCILE_PAYMENT',
          metadata: {
            provider: 'ALATPAY',
            transactionRef,
            outcome: result.outcome,
            reason: result.reason ?? null,
            orderId: result.orderId ?? null,
          },
        },
      })
      .catch((e: Error) =>
        this.logger.error(`Failed to audit reconciliation: ${e.message}`),
      );

    const order = result.orderId
      ? await this.prisma.order.findUnique({
          where: { id: result.orderId },
          select: { status: true, reference: true },
        })
      : null;

    return {
      outcome: result.outcome,
      reason: result.reason ?? null,
      orderStatus: order?.status ?? null,
      reference: order?.reference ?? null,
    };
  }
}
