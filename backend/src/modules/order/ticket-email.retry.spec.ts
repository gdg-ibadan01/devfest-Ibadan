// The real TicketsService pulls in the PDF renderer (.tsx), which Jest isn't set up for.
jest.mock('../ticket/ticket.service', () => ({ TicketsService: class {} }));
// The registry pulls in the payment gateways (MonnifyService -> dinero.js, an
// ESM-only package Jest can't parse). These tests don't touch payments.
jest.mock('../payment/payment-provider.registry', () => ({
  PaymentProviderRegistry: class {},
}));

import { OrdersService } from './order.service';
import { TicketEmailSweeper } from './ticket-email.sweeper';

type Row = {
  id: string;
  reference: string;
  attendeeFullName: string;
  attendeeEmail: string;
  status: 'PAID';
  ticketEmailStatus: 'PENDING' | 'FAILED' | 'SENT' | null;
  ticketEmailAttempts: number;
  ticketUrl: string | null;
  groupReference: null;
  amount: number;
  updatedAt: Date;
  ticket: { validityDates: Date[] };
};

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);

function setup(
  rows: Partial<Row>[],
  opts: { budget?: () => number; failFor?: string[] } = {},
) {
  const orders: Row[] = rows.map((r, i) => ({
    id: `o${i + 1}`,
    reference: `REF${i + 1}ABCDEF`,
    attendeeFullName: `Person ${i + 1}`,
    attendeeEmail: `p${i + 1}@x.com`,
    status: 'PAID',
    ticketEmailStatus: 'PENDING',
    ticketEmailAttempts: 0,
    ticketUrl: 'https://pdf',
    groupReference: null,
    amount: 5000,
    updatedAt: minutesAgo(30),
    ticket: { validityDates: [] },
    ...r,
  }));

  const matches = (o: Row, where: any): boolean => {
    if (where.id && o.id !== where.id) return false;
    if (
      'ticketEmailStatus' in where &&
      typeof where.ticketEmailStatus !== 'object' &&
      o.ticketEmailStatus !== where.ticketEmailStatus
    )
      return false;
    if (
      where.updatedAt instanceof Date &&
      o.updatedAt.getTime() !== where.updatedAt.getTime()
    )
      return false;
    if (where.OR) return where.OR.some((c: any) => matchOr(o, c));
    return true;
  };
  const matchOr = (o: Row, c: any): boolean => {
    const st = c.ticketEmailStatus;
    if (st === null) return o.ticketEmailStatus === null;
    if (st && typeof st === 'object' && 'not' in st)
      return o.ticketEmailStatus !== st.not;
    if (st !== undefined && o.ticketEmailStatus !== st) return false;
    if (
      c.ticketEmailAttempts?.lt !== undefined &&
      !(o.ticketEmailAttempts < c.ticketEmailAttempts.lt)
    )
      return false;
    if (c.updatedAt?.lt && !(o.updatedAt < c.updatedAt.lt)) return false;
    return true;
  };
  const apply = (o: Row, data: any) => {
    for (const [k, v] of Object.entries(data)) {
      if (v && typeof v === 'object' && 'increment' in (v as object))
        (o as any)[k] += (v as any).increment;
      else (o as any)[k] = v;
    }
    o.updatedAt = new Date();
  };

  const prisma = {
    order: {
      findMany: jest.fn(async ({ where, take }: any) =>
        orders
          .filter((o) => o.status === 'PAID' && matches(o, where))
          .slice(0, take),
      ),
      updateMany: jest.fn(async ({ where, data }: any) => {
        const hit = orders.filter((o) => matches(o, where));
        hit.forEach((o) => apply(o, data));
        return { count: hit.length };
      }),
      update: jest.fn(async ({ where, data }: any) =>
        apply(
          orders.find((o) => o.id === where.id)!,
          data,
        ),
      ),
    },
    auditLog: { create: jest.fn() },
  };
  const sentTo: string[] = [];
  const mail = {
    remainingBudget: jest.fn(opts.budget ?? (() => Infinity)),
    sendTicketConfirmationEmail: jest.fn(
      async ({ email }: { email: string }) => {
        if (opts.failFor?.includes(email)) throw new Error('550 rejected');
        sentTo.push(email);
      },
    ),
  };
  const tickets = { ensureTicketPdf: jest.fn(async () => 'https://new-pdf') };
  const appConfig = { ticketJWTSecret: 's', url: 'https://api.test' };
  const svc = new OrdersService(
    prisma as never,
    mail as never,
    {} as never,
    tickets as never,
    appConfig as never,
  );
  return { svc, orders, mail, tickets, sentTo, prisma };
}

describe('ticket email retry', () => {
  it('sends stuck PENDING orders and marks them SENT', async () => {
    const t = setup([{}, {}]);
    const res = await t.svc.retryUnconfirmedTicketEmails();
    expect(res).toEqual({ attempted: 2, sent: 2 });
    expect(t.orders.every((o) => o.ticketEmailStatus === 'SENT')).toBe(true);
  });

  it('leaves fresh PENDING orders alone (the original send may still be running)', async () => {
    const t = setup([{ updatedAt: minutesAgo(1) }]);
    expect(await t.svc.retryUnconfirmedTicketEmails()).toEqual({
      attempted: 0,
      sent: 0,
    });
    expect(t.mail.sendTicketConfirmationEmail).not.toHaveBeenCalled();
  });

  it('retries FAILED orders after the wait, but not past the attempt cap', async () => {
    const t = setup([
      { ticketEmailStatus: 'FAILED', ticketEmailAttempts: 2 },
      { ticketEmailStatus: 'FAILED', ticketEmailAttempts: 5 },
      {
        ticketEmailStatus: 'FAILED',
        ticketEmailAttempts: 1,
        updatedAt: minutesAgo(2),
      },
    ]);
    const res = await t.svc.retryUnconfirmedTicketEmails();
    expect(res.attempted).toBe(1);
    expect(t.sentTo).toEqual(['p1@x.com']);
  });

  it('never touches SENT or unknown (legacy) orders', async () => {
    const t = setup([
      { ticketEmailStatus: 'SENT' },
      { ticketEmailStatus: null },
    ]);
    expect((await t.svc.retryUnconfirmedTicketEmails()).attempted).toBe(0);
  });

  it('records a failure and keeps it for the next round', async () => {
    const t = setup([{}], { failFor: ['p1@x.com'] });
    await t.svc.retryUnconfirmedTicketEmails();
    expect(t.orders[0]).toMatchObject({
      ticketEmailStatus: 'FAILED',
      ticketEmailAttempts: 1,
    });
  });

  it('does not attempt anything while the mail budget is used up', async () => {
    const t = setup([{}, {}], { budget: () => 0 });
    expect(await t.svc.retryUnconfirmedTicketEmails()).toEqual({
      attempted: 0,
      sent: 0,
    });
    expect(t.mail.sendTicketConfirmationEmail).not.toHaveBeenCalled();
  });

  it('only sends as many as the budget allows', async () => {
    let left = 2;
    const t = setup([{}, {}, {}, {}], { budget: () => left });
    t.mail.sendTicketConfirmationEmail.mockImplementation(
      async ({ email }: { email: string }) => {
        left--;
        t.sentTo.push(email);
      },
    );
    const res = await t.svc.retryUnconfirmedTicketEmails();
    expect(res.sent).toBe(2);
    expect(
      t.orders.filter((o) => o.ticketEmailStatus === 'PENDING'),
    ).toHaveLength(2);
  });

  it('regenerates a missing ticket PDF before sending', async () => {
    const t = setup([{ ticketUrl: null }]);
    await t.svc.retryUnconfirmedTicketEmails();
    expect(t.tickets.ensureTicketPdf).toHaveBeenCalledTimes(1);
    expect(t.orders[0].ticketEmailStatus).toBe('SENT');
  });

  it('skips an order another instance already claimed', async () => {
    const t = setup([{}]);
    t.prisma.order.updateMany.mockResolvedValueOnce({ count: 0 });
    expect((await t.svc.retryUnconfirmedTicketEmails()).attempted).toBe(0);
    expect(t.mail.sendTicketConfirmationEmail).not.toHaveBeenCalled();
  });

  it('a failed manual resend does not downgrade an order already confirmed SENT', async () => {
    const t = setup([{ ticketEmailStatus: 'SENT' }], { failFor: ['p1@x.com'] });
    (t.prisma.order as any).findUnique = jest.fn(async () => t.orders[0]);
    const res = await t.svc.resendTicketEmail('o1', 'admin');
    expect(res).toEqual({ sent: false, deferred: false });
    expect(t.orders[0].ticketEmailStatus).toBe('SENT');
  });

  it('a manual resend with no budget is deferred, not lost', async () => {
    const t = setup([{ ticketEmailStatus: 'FAILED', ticketEmailAttempts: 5 }], {
      budget: () => 0,
    });
    (t.prisma.order as any).findUnique = jest.fn(async () => t.orders[0]);
    const res = await t.svc.resendTicketEmail('o1', 'admin');
    expect(res).toEqual({ sent: false, deferred: true });
    expect(t.orders[0].ticketEmailStatus).toBe('PENDING'); // the retry job sends it when there is room
  });

  it('the sweeper skips a round while the previous one is still running', async () => {
    const orders = {
      retryUnconfirmedTicketEmails: jest.fn(
        () => new Promise((r) => setTimeout(r, 30)),
      ),
    };
    const sweeper = new TicketEmailSweeper(orders as never);
    await Promise.all([sweeper.tick(), sweeper.tick()]);
    expect(orders.retryUnconfirmedTicketEmails).toHaveBeenCalledTimes(1);
  });
});
