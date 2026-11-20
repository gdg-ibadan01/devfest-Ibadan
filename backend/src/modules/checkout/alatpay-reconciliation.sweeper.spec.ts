jest.mock('./payment-confirmation.service', () => ({
  PaymentConfirmationService: class {},
}));
jest.mock('../payment/alatpay.service', () => ({ AlatpayService: class {} }));

import { AlatpayReconciliationSweeper } from './alatpay-reconciliation.sweeper';

describe('AlatpayReconciliationSweeper.confirmByRecordedIds', () => {
  it('re-checks unpaid orders by their recorded transaction id', async () => {
    const prisma = {
      order: {
        findMany: jest.fn().mockResolvedValue([
          { reference: 'R1', providerTransactionRef: 'tx-1' },
          { reference: 'R2', providerTransactionRef: 'tx-2' },
        ]),
      },
    };
    const confirmation = {
      confirm: jest
        .fn()
        .mockResolvedValueOnce({ outcome: 'PROCESSED' })
        .mockRejectedValueOnce(new Error('gateway down')),
    };
    const sweeper = new AlatpayReconciliationSweeper(
      prisma as never,
      {} as never,
      confirmation as never,
    );

    expect(await sweeper.confirmByRecordedIds()).toBe(1);
    expect(confirmation.confirm).toHaveBeenCalledWith({
      provider: 'ALATPAY',
      transactionRef: 'tx-1',
      source: 'SWEEPER',
      expectedReference: 'R1',
    });
    const where = prisma.order.findMany.mock.calls[0][0].where;
    expect(where.providerTransactionRef).toEqual({ not: null });
  });
});
