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
  assets?: Record<string, unknown>[];
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
    emailCampaignAsset: {
      findMany: jest.fn(async () => opts.assets ?? []),
      findFirst: jest.fn(),
      create: jest.fn(async ({ data }: { data: object }) => ({
        id: 'a1',
        ...data,
      })),
      delete: jest.fn(),
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
  const upload = {
    uploadEmailAsset: jest.fn(async () => ({
      url: 'https://res.cloudinary.com/x/raw/upload/f.pdf',
      publicId: 'email-assets/f',
      resourceType: 'raw',
    })),
    deleteEmailAsset: jest.fn(async () => undefined),
  };
  const appConfig = {
    ticketJWTSecret: 's',
    url: 'https://api.example.com',
    logoUrl: 'https://example.com/logo.png',
  };

  const service = new EmailCampaignService(
    prisma as never,
    mail as never,
    upload as never,
    appConfig as never,
  );
  (
    service as unknown as { attachmentRetryDelayMs: number }
  ).attachmentRetryDelayMs = 1;
  const done = async () => {
    for (let i = 0; i < 200 && campaign.status === 'SENDING'; i++) {
      await new Promise((r) => setTimeout(r, 5));
    }
  };
  return { service, prisma, mail, upload, campaign, deliveries, sent, done };
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

describe('EmailCampaignService attachments', () => {
  const pdfAsset = {
    id: 'a1',
    filename: 'agenda.pdf',
    mimeType: 'application/pdf',
    size: 1234,
    url: 'https://res.cloudinary.com/x/raw/upload/agenda.pdf',
    kind: 'ATTACHMENT',
  };
  const realFetch = global.fetch;
  afterEach(() => {
    global.fetch = realFetch;
  });
  const fetchOk = () =>
    jest.fn(async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => new TextEncoder().encode('%PDF-1.4').buffer,
    })) as unknown as typeof fetch;

  it('downloads each attachment once and sends it to every recipient', async () => {
    const t = setup({
      orders: [order(1), order(2), order(3)],
      assets: [pdfAsset],
    });
    global.fetch = fetchOk();
    await t.service.send('c1', 'admin1');
    await t.done();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(t.mail.sendCustomEmail).toHaveBeenCalledTimes(3);
    for (const call of t.mail.sendCustomEmail.mock.calls as unknown as [
      { attachments: { filename: string; contentType: string }[] },
    ][]) {
      expect(call[0].attachments).toEqual([
        expect.objectContaining({
          filename: 'agenda.pdf',
          contentType: 'application/pdf',
        }),
      ]);
    }
    expect(t.campaign.status).toBe('SENT');
  });

  it('refuses to start a send when an attachment cannot be fetched', async () => {
    const t = setup({ orders: [order(1), order(2)], assets: [pdfAsset] });
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 404,
    })) as unknown as typeof fetch;
    await expect(t.service.send('c1', 'admin1')).rejects.toThrow(/agenda\.pdf/);
    expect(t.mail.sendCustomEmail).not.toHaveBeenCalled();
    expect(t.campaign.status).toBe('DRAFT');
    expect(t.deliveries).toHaveLength(0);
  });

  it('fails the waiting deliveries instead of sending without files on a later run', async () => {
    const t = setup({ orders: [], assets: [pdfAsset], status: 'SENDING' });
    t.deliveries.push(
      ...[1, 2].map((n) => ({
        id: `d${n}`,
        campaignId: 'c1',
        orderId: `o${n}`,
        email: `p${n}@x.com`,
        fullName: `Person ${n}`,
        status: 'PENDING' as const,
        attempts: 0,
        error: null,
      })),
    );
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 404,
    })) as unknown as typeof fetch;
    t.prisma.emailDelivery.updateMany.mockImplementation(
      async ({ data }: { data: { status: 'FAILED'; error: string } }) => {
        t.deliveries.forEach((d) => {
          if (d.status === 'PENDING') Object.assign(d, data);
        });
      },
    );
    const result = await (
      t.service as unknown as {
        attachmentsForRun: (id: string) => Promise<unknown>;
      }
    ).attachmentsForRun('c1');
    expect(result).toBeNull();
    expect(t.mail.sendCustomEmail).not.toHaveBeenCalled();
    expect(t.deliveries.every((d) => d.status === 'FAILED')).toBe(true);
    expect(t.deliveries[0].error).toMatch(/agenda\.pdf/);
    expect(t.campaign.status).toBe('FAILED');
  });

  it('refuses to add a file to a campaign that was already sent', async () => {
    const t = setup({ orders: [order(1)], status: 'SENT' });
    const file = {
      originalname: 'a.pdf',
      mimetype: 'application/pdf',
      size: 8,
      buffer: Buffer.from('%PDF-1.4'),
    } as Express.Multer.File;
    await expect(
      t.service.addAsset('c1', 'admin1', file, 'ATTACHMENT' as never),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(t.upload.uploadEmailAsset).not.toHaveBeenCalled();
  });

  it('enforces the attachment count and total size', async () => {
    const file = {
      originalname: 'a.pdf',
      mimetype: 'application/pdf',
      size: 8,
      buffer: Buffer.from('%PDF-1.4'),
    } as Express.Multer.File;
    const five = Array.from({ length: 5 }, (_, i) => ({
      id: `a${i}`,
      size: 10,
    }));
    const t1 = setup({ orders: [], assets: five });
    await expect(
      t1.service.addAsset('c1', 'admin1', file, 'ATTACHMENT' as never),
    ).rejects.toThrow(/at most 5/);
    const t2 = setup({
      orders: [],
      assets: [{ id: 'a1', size: 10 * 1024 * 1024 }],
    });
    await expect(
      t2.service.addAsset('c1', 'admin1', file, 'ATTACHMENT' as never),
    ).rejects.toThrow(/10 MB/);
  });

  it('stores a valid attachment and records who added it', async () => {
    const t = setup({ orders: [] });
    const file = {
      originalname: 'agenda.pdf',
      mimetype: 'application/pdf',
      size: 8,
      buffer: Buffer.from('%PDF-1.4'),
    } as Express.Multer.File;
    const asset = await t.service.addAsset(
      'c1',
      'admin1',
      file,
      'ATTACHMENT' as never,
    );
    expect(asset).toMatchObject({
      filename: 'agenda.pdf',
      createdById: 'admin1',
    });
    expect(t.upload.uploadEmailAsset).toHaveBeenCalledWith(file.buffer, {
      image: false,
      filename: 'agenda.pdf',
    });
  });
});
