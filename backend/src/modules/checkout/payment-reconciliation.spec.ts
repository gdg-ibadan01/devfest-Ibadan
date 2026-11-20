jest.mock('./payment-confirmation.service', () => ({
  PaymentConfirmationService: class {},
}));
jest.mock('../payment/alatpay.service', () => ({ AlatpayService: class {} }));

import { OrderStatus, Prisma } from '@prisma/client';
import { PaymentReconciliationService } from './payment-reconciliation.service';

const tx = (o: Record<string, unknown>) => ({
  provider: 'ALATPAY',
  transactionRef: 'T1',
  status: 'COMPLETED',
  amount: 5000,
  currency: 'NGN',
  orderId: null,
  reference: null,
  orderToken: null,
  paidAt: '2026-11-21T08:00:00Z',
  description: null,
  raw: {},
  ...o,
});

const order = (o: Record<string, unknown>) => ({
  id: 'o1',
  reference: 'R1',
  status: OrderStatus.AWAITING_PAYMENT,
  attendeeFullName: 'Ada',
  attendeeEmail: 'ada@x.com',
  amount: new Prisma.Decimal(5000),
  createdAt: new Date(),
  ticket: { name: 'Regular' },
  ...o,
});

function build(transactions: unknown[], orders: unknown[], configured = true) {
  const prisma = {
    order: {
      findMany: jest.fn().mockResolvedValue(orders),
      findUnique: jest
        .fn()
        .mockResolvedValue({ status: 'PAID', reference: 'R1' }),
    },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
  };
  const alatpay = {
    isConfigured: () => configured,
    listTransactions: jest.fn().mockResolvedValue(transactions),
  };
  const confirmation = {
    confirm: jest
      .fn()
      .mockResolvedValue({ outcome: 'PROCESSED', orderId: 'o1' }),
  };
  return {
    svc: new PaymentReconciliationService(
      prisma as never,
      alatpay as never,
      confirmation as never,
    ),
    prisma,
    alatpay,
    confirmation,
  };
}

describe('PaymentReconciliationService', () => {
  it('lists completed transactions whose order is not PAID, skips paid ones', async () => {
    const { svc } = build(
      [
        tx({ transactionRef: 'A', orderId: 'o1' }),
        tx({ transactionRef: 'B', orderId: 'o2' }),
        tx({ transactionRef: 'C', reference: 'R9' }),
        tx({ transactionRef: 'D', status: 'PENDING', orderId: 'o1' }),
      ],
      [
        order({}),
        order({ id: 'o2', reference: 'R2', status: OrderStatus.PAID }),
      ],
    );
    const res = await svc.list(6);
    expect(res.scanned).toBe(3);
    expect(res.items.map((i) => [i.transactionRef, i.issue])).toEqual([
      ['A', 'ORDER_NOT_PAID'],
      ['C', 'ORDER_NOT_FOUND'],
    ]);
  });

  it('returns an empty, unconfigured result without calling the gateway', async () => {
    const { svc, alatpay } = build([], [], false);
    const res = await svc.list(6);
    expect(res.configured).toBe(false);
    expect(alatpay.listTransactions).not.toHaveBeenCalled();
  });

  it('confirms via the normal path and audits it', async () => {
    const { svc, confirmation, prisma } = build([], []);
    const res = await svc.confirm('A', 'admin-1');
    expect(confirmation.confirm).toHaveBeenCalledWith({
      provider: 'ALATPAY',
      transactionRef: 'A',
      source: 'ADMIN',
    });
    expect(prisma.auditLog.create).toHaveBeenCalled();
    expect(res).toMatchObject({ outcome: 'PROCESSED', orderStatus: 'PAID' });
  });
});
