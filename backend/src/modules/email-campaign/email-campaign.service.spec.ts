import { BadRequestException } from '@nestjs/common';
import { EmailCampaignService } from './email-campaign.service';

type Delivery = {
  id: string;
  campaignId: string;
  orderId: string;
  email: string;
  fullName: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  attempts: number;
  error: string | null;
};

function setup(opts: {
  orders: {
    id: string;
    reference: string;
    attendeeEmail: string;
    attendeeFullName: string;
  }[];
  failFor?: string[];
  status?: string;
}) {
  const campaign: Record<string, unknown> = {
    id: 'c1',
    subject: 'Hi {{first_name}}',
    preheader: '',
    body: 'Hello',
    audience: {},
    status: opts.status ?? 'DRAFT',
  };
  const deliveries: Delivery[] = [];
  let seq = 0;

  const prisma = {
    order: { findMany: jest.fn().mockResolvedValue(opts.orders) },
    emailCampaign: {
      findUnique: jest.fn(async () => ({ ...campaign })),
      update: jest.fn(async ({ data }: { data: object }) =>
        Object.assign(campaign, data),
      ),
    },
    emailDelivery: {
      createMany: jest.fn(
        async ({
          data,
        }: {
          data: Omit<Delivery, 'id' | 'status' | 'attempts' | 'error'>[];
        }) => {
          for (const d of data) {
            if (
              deliveries.some(
                (x) => x.campaignId === d.campaignId && x.email === d.email,
              )
            )
              continue;
            deliveries.push({
              ...d,
              id: `d${++seq}`,
              status: 'PENDING',
              attempts: 0,
              error: null,
            });
          }
        },
      ),
      findMany: jest.fn(
        async ({ where, take }: { where: { status: string }; take: number }) =>
          deliveries
            .filter((d) => d.status === where.status)
            .slice(0, take)
            .map((d) => ({ ...d, order: { reference: `REF-${d.orderId}` } })),
      ),
      update: jest.fn(
        async ({
          where,
          data,
        }: {
          where: { id: string };
          data: Record<string, unknown>;
        }) => {
          const d = deliveries.find((x) => x.id === where.id)!;
          const { attempts, ...rest } = data as {
            attempts?: number | { increment: number };
          };
          if (typeof attempts === 'number') d.attempts = attempts;
          else if (attempts) d.attempts += attempts.increment;
          Object.assign(d, rest);
        },
      ),
      updateMany: jest.fn(),
      groupBy: jest.fn(async () => {
        const counts = new Map<string, number>();
        deliveries.forEach((d) =>
          counts.set(d.status, (counts.get(d.status) ?? 0) + 1),
        );
        return [...counts].map(([status, n]) => ({
          status,
          _count: { _all: n },
        }));
      }),
    },
    admin: { findUnique: jest.fn(async () => ({ email: 'me@x.com' })) },
    auditLog: { create: jest.fn(async () => ({})) },
    $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  };

  const sent: string[] = [];
  const mail = {
    remainingBudget: jest.fn(() => Infinity),
    supportEmail: () => 'help@example.com',
    sendCustomEmail: jest.fn(async ({ to }: { to: string }) => {
      if (opts.failFor?.includes(to))
        throw new Error('550 mailbox unavailable');
      sent.push(to);
      return { messageId: `m-${to}` };
    }),
  };
  const appConfig = {
    ticketJWTSecret: 's',
    url: 'https://api.example.com',
    logoUrl: 'https://example.com/logo.png',
  };

  const service = new EmailCampaignService(
    prisma as never,
    mail as never,
    appConfig as never,
  );
  const done = async () => {
    for (let i = 0; i < 200 && campaign.status === 'SENDING'; i++) {
      await new Promise((r) => setTimeout(r, 5));
    }
  };
  return { service, prisma, mail, campaign, deliveries, sent, done };
}

const order = (n: number, email = `p${n}@x.com`) => ({
  id: `o${n}`,
  reference: `REF${n}`,
  attendeeEmail: email,
  attendeeFullName: `Person ${n}`,
});

describe('EmailCampaignService', () => {
  it('queues one delivery per unique email and sends them all', async () => {
    const t = setup({ orders: [order(1), order(2), order(3, 'P1@X.com')] });
    const res = await t.service.send('c1', 'admin1');
    expect(res.queued).toBe(2); // third is a case-insensitive duplicate of the first
    await t.done();
    expect(t.sent.sort()).toEqual(['p1@x.com', 'p2@x.com']);
    expect(t.campaign.status).toBe('SENT');
    expect(t.deliveries.every((d) => d.status === 'SENT')).toBe(true);
  });

  it('marks the campaign PARTIAL when some sends fail, without stopping', async () => {
    const t = setup({
      orders: [order(1), order(2), order(3)],
      failFor: ['p2@x.com'],
    });
    await t.service.send('c1', 'admin1');
    await t.done();
    expect(t.sent.sort()).toEqual(['p1@x.com', 'p3@x.com']);
    expect(t.campaign.status).toBe('PARTIAL');
    expect(t.deliveries.find((d) => d.email === 'p2@x.com')).toMatchObject({
      status: 'FAILED',
      attempts: 1,
    });
  });

  it('does not send a campaign twice', async () => {
    const t = setup({ orders: [order(1)], status: 'SENT' });
    await expect(t.service.send('c1', 'admin1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(t.mail.sendCustomEmail).not.toHaveBeenCalled();
  });

  it('refuses to send when nobody matches', async () => {
    const t = setup({ orders: [] });
    await expect(t.service.send('c1', 'admin1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('never sends more than the mail budget allows in one batch', async () => {
    const t = setup({ orders: [order(1), order(2), order(3), order(4)] });
    let budget = 2;
    t.mail.remainingBudget.mockImplementation(() => budget);
    t.mail.sendCustomEmail.mockImplementation(
      async ({ to }: { to: string }) => {
        budget--;
        t.sent.push(to);
        return { messageId: to };
      },
    );
    await t.service.send('c1', 'admin1');
    await new Promise((r) => setTimeout(r, 100));
    expect(t.sent).toHaveLength(2); // budget exhausted: the rest waits, nothing is dropped
    expect(t.deliveries.filter((d) => d.status === 'PENDING')).toHaveLength(2);
    expect(t.campaign.status).toBe('SENDING');
    budget = 0; // keep the background loop idle for the rest of the test run
  });

  describe('sendTest', () => {
    it('defaults to the admin’s own address', async () => {
      const t = setup({ orders: [] });
      const res = await t.service.sendTest('c1', 'admin1');
      expect(res).toEqual({ sent: ['me@x.com'], failed: [] });
      expect(t.mail.sendCustomEmail).toHaveBeenCalledTimes(1);
    });

    it('sends to every entered address, de-duplicated, marked [Test]', async () => {
      const t = setup({ orders: [] });
      const res = await t.service.sendTest('c1', 'admin1', [
        'me@x.com',
        'org1@x.com',
        'ORG1@x.com',
        ' org2@x.com ',
      ]);
      expect(res.sent).toEqual(['me@x.com', 'org1@x.com', 'org2@x.com']);
      const subjects = t.mail.sendCustomEmail.mock.calls.map(
        (c) => (c[0] as unknown as { subject: string }).subject,
      );
      expect(subjects.every((s) => s.startsWith('[Test] '))).toBe(true);
    });

    it('reports a failing address without blocking the others', async () => {
      const t = setup({ orders: [], failFor: ['bad@x.com'] });
      const res = await t.service.sendTest('c1', 'admin1', [
        'a@x.com',
        'bad@x.com',
        'b@x.com',
      ]);
      expect(res.sent).toEqual(['a@x.com', 'b@x.com']);
      expect(res.failed).toEqual([
        { email: 'bad@x.com', error: '550 mailbox unavailable' },
      ]);
    });

    it('does not queue deliveries or change the campaign', async () => {
      const t = setup({ orders: [order(1)] });
      await t.service.sendTest('c1', 'admin1', ['a@x.com']);
      expect(t.deliveries).toHaveLength(0);
      expect(t.campaign.status).toBe('DRAFT');
    });
  });
});
