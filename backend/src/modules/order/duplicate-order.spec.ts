jest.mock('../ticket/ticket.service', () => ({ TicketsService: class {} }));
jest.mock('../payment/payment-provider.registry', () => ({
  PaymentProviderRegistry: class {},
}));

import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrdersService } from './order.service';
import {
  DuplicateOrderError,
  duplicateOrderConflict,
} from './duplicate-order.error';

type Existing = {
  status: 'PAID' | 'AWAITING_PAYMENT';
  amount: Prisma.Decimal;
  reference: string;
  attendeeEmail: string;
  gifterEmail: string | null;
  groupReference: string | null;
};

const order = (o: Partial<Existing> = {}): Existing => ({
  status: 'AWAITING_PAYMENT',
  amount: new Prisma.Decimal(5000),
  reference: 'REF-SELF',
  attendeeEmail: 'buyer@x.com',
  gifterEmail: null,
  groupReference: null,
  ...o,
});

function build(groupPayerOrder: Partial<Existing> | null = null) {
  const tx = {
    order: { findFirst: jest.fn().mockResolvedValue(groupPayerOrder) },
  };
  const svc = new OrdersService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  );
  const call = (existing: Existing, payer: string) =>
    (
      svc as unknown as {
        duplicateOrderError(
          tx: unknown,
          e: Existing,
          p: string,
        ): Promise<DuplicateOrderError>;
      }
    ).duplicateOrderError(tx, existing, payer);
  return { call, tx };
}

describe('duplicate order', () => {
  it('offers the unpaid order back to the same buyer', async () => {
    const err = await build().call(order(), 'buyer@x.com');
    expect(err.pendingReference).toBe('REF-SELF');
  });

  it('does not offer a paid order', async () => {
    const err = await build().call(order({ status: 'PAID' }), 'buyer@x.com');
    expect(err.pendingReference).toBeNull();
    expect(err.message).toBe('You already have an order for this ticket');
  });

  it('offers a gift order back only to the gifter who started it', async () => {
    const gift = order({
      reference: 'REF-GIFT',
      attendeeEmail: 'friend@x.com',
      gifterEmail: 'gifter@x.com',
    });
    const { call } = build();
    expect((await call(gift, 'gifter@x.com')).pendingReference).toBe(
      'REF-GIFT',
    );
    expect(
      (await call(gift, 'someone-else@x.com')).pendingReference,
    ).toBeNull();
  });

  it("resolves a group member's clash to the payer's order", async () => {
    const member = order({
      amount: new Prisma.Decimal(0),
      attendeeEmail: 'member@x.com',
      groupReference: 'G1',
      reference: 'REF-MEMBER',
    });
    const { call, tx } = build({
      reference: 'REF-PAYER',
      attendeeEmail: 'payer@x.com',
      gifterEmail: null,
    });
    expect((await call(member, 'payer@x.com')).pendingReference).toBe(
      'REF-PAYER',
    );
    expect(tx.order.findFirst).toHaveBeenCalled();
    expect((await call(member, 'other@x.com')).pendingReference).toBeNull();
  });

  it('puts pendingReference in the 409 body only when resumable', () => {
    const resumable = duplicateOrderConflict(
      new DuplicateOrderError('m', 'R1'),
    );
    expect(resumable.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(resumable.getResponse()).toMatchObject({ pendingReference: 'R1' });

    const plain = duplicateOrderConflict(new DuplicateOrderError('m'));
    expect(plain.getResponse()).not.toHaveProperty('pendingReference');
  });
});
