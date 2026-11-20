jest.mock('../order/order.service', () => ({ OrdersService: class {} }));
jest.mock('../payment/payment-provider.registry', () => ({
  PaymentProviderRegistry: class {},
}));

import { OrderStatus } from '@prisma/client';
import { PaymentConfirmationService } from './payment-confirmation.service';
import { GatewayRequestError } from '../payment/interfaces/payment-provider.interface';

type OrderRow = {
  id: string;
  status: OrderStatus;
  paymentProvider: string;
  providerTransactionRef: string | null;
  createdAt: Date;
};

function build(order: OrderRow, listHit: string | null = null) {
  const prisma = {
    order: {
      findFirst: jest.fn().mockResolvedValue(order),
      findUnique: jest.fn().mockResolvedValue({ status: OrderStatus.PAID }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };
  const payments = { for: () => ({ name: order.paymentProvider }) };
  const alatpay = {
    findCompletedTransactionRef: jest.fn().mockResolvedValue(listHit),
  };
  const svc = new PaymentConfirmationService(
    prisma as never,
    payments as never,
    alatpay as never,
    {} as never,
  );
  const confirm = jest
    .spyOn(svc, 'confirm')
    .mockResolvedValue({ outcome: 'PROCESSED', orderId: order.id });
  return { svc, prisma, alatpay, confirm };
}

const pending = (o: Partial<OrderRow> = {}): OrderRow => ({
  id: 'o1',
  status: OrderStatus.AWAITING_PAYMENT,
  paymentProvider: 'ALATPAY',
  providerTransactionRef: null,
  createdAt: new Date(),
  ...o,
});

describe('PaymentConfirmationService.verifyFromClient', () => {
  it('records the transaction id a pending bank transfer reports', async () => {
    const { svc, prisma, confirm } = build(pending());
    confirm.mockResolvedValue({ outcome: 'NOT_COMPLETED' });
    await svc.verifyFromClient('REF', 'tx-1');
    expect(prisma.order.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ providerTransactionRef: null }),
        data: { providerTransactionRef: 'tx-1' },
      }),
    );
  });

  it('re-checks by the stored id when none is supplied (one-click resolve)', async () => {
    const { svc, confirm, alatpay } = build(
      pending({ providerTransactionRef: 'tx-stored' }),
    );
    const res = await svc.verifyFromClient('REF', undefined, 'ADMIN');
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionRef: 'tx-stored',
        expectedReference: 'REF',
      }),
    );
    expect(alatpay.findCompletedTransactionRef).not.toHaveBeenCalled();
    expect(res).toEqual({ status: OrderStatus.PAID, outcome: 'PROCESSED' });
  });

  it('falls back to the order lookup when the stored id is bad', async () => {
    const { svc, confirm } = build(
      pending({ providerTransactionRef: 'garbage' }),
      'tx-real',
    );
    confirm
      .mockRejectedValueOnce(new GatewayRequestError('not found', false, 404))
      .mockResolvedValueOnce({ outcome: 'PROCESSED', orderId: 'o1' });
    const res = await svc.verifyFromClient('REF', undefined, 'ADMIN');
    expect(confirm).toHaveBeenLastCalledWith(
      expect.objectContaining({ transactionRef: 'tx-real' }),
    );
    expect(res.outcome).toBe('PROCESSED');
  });

  it('surfaces errors for an id the admin typed', async () => {
    const { svc, confirm } = build(pending());
    confirm.mockRejectedValue(new GatewayRequestError('not found', false, 404));
    await expect(
      svc.verifyFromClient('REF', 'typo', 'ADMIN'),
    ).rejects.toBeInstanceOf(GatewayRequestError);
  });

  it('does not overwrite an id already on the order', async () => {
    const { svc, prisma } = build(pending({ providerTransactionRef: 'first' }));
    await svc.verifyFromClient('REF', 'second');
    expect(prisma.order.updateMany).not.toHaveBeenCalled();
  });

  it('leaves paid orders alone', async () => {
    const { svc, confirm } = build(pending({ status: OrderStatus.PAID }));
    expect(await svc.verifyFromClient('REF', 'tx')).toEqual({
      status: OrderStatus.PAID,
      outcome: 'ALREADY_FINAL',
    });
    expect(confirm).not.toHaveBeenCalled();
  });
});
