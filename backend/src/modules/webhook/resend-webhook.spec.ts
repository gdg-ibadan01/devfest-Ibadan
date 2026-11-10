import { createHmac } from 'crypto';
import { ResendWebhookService } from './resend-webhook.service';
import { parseEmailEvent, verifySvixSignature } from './resend-webhook.util';

const KEY = Buffer.from('super-secret-key-bytes-1234567890');
const SECRET = `whsec_${KEY.toString('base64')}`;
const NOW = 1_800_000_000;

function sign(id: string, ts: number, body: string, key = KEY) {
  return `v1,${createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest('base64')}`;
}

describe('verifySvixSignature', () => {
  const body = '{"type":"email.delivered"}';
  const ok = (over: object = {}) =>
    verifySvixSignature(
      SECRET,
      body,
      {
        id: 'msg_1',
        timestamp: String(NOW),
        signature: sign('msg_1', NOW, body),
        ...over,
      },
      NOW,
    );

  it('accepts a correctly signed request', () => expect(ok()).toBe(true));
  it('accepts when one of several signatures matches', () =>
    expect(ok({ signature: `v1,AAAA ${sign('msg_1', NOW, body)}` })).toBe(
      true,
    ));
  it('rejects a tampered body', () =>
    expect(
      verifySvixSignature(
        SECRET,
        body + ' ',
        {
          id: 'msg_1',
          timestamp: String(NOW),
          signature: sign('msg_1', NOW, body),
        },
        NOW,
      ),
    ).toBe(false));
  it('rejects the wrong secret', () =>
    expect(
      ok({ signature: sign('msg_1', NOW, body, Buffer.from('other')) }),
    ).toBe(false));
  it('rejects a stale timestamp (replay)', () =>
    expect(
      verifySvixSignature(
        SECRET,
        body,
        {
          id: 'msg_1',
          timestamp: String(NOW - 600),
          signature: sign('msg_1', NOW - 600, body),
        },
        NOW,
      ),
    ).toBe(false));
  it('rejects missing headers or secret', () => {
    expect(ok({ signature: undefined })).toBe(false);
    expect(
      verifySvixSignature(
        '',
        body,
        { id: 'a', timestamp: String(NOW), signature: sign('a', NOW, body) },
        NOW,
      ),
    ).toBe(false);
  });
});

describe('parseEmailEvent', () => {
  it('maps a bounce with its reason', () => {
    const e = parseEmailEvent({
      type: 'email.bounced',
      created_at: '2026-11-10T10:00:00Z',
      data: {
        message_id: '<a@b>',
        to: ['x@y.com'],
        bounce: {
          type: 'Permanent',
          subType: 'General',
          message: 'No such user',
        },
      },
    });
    expect(e).toMatchObject({
      state: 'BOUNCED',
      messageId: '<a@b>',
      to: ['x@y.com'],
      detail: 'Permanent/General: No such user',
    });
  });
  it('ignores event types we do not track', () => {
    expect(parseEmailEvent({ type: 'email.opened', data: {} })).toBeNull();
    expect(parseEmailEvent({ type: 'email.sent', data: {} })).toBeNull();
    expect(parseEmailEvent(null)).toBeNull();
  });
});

describe('ResendWebhookService', () => {
  function setup(opts: { orderByMsg?: boolean; current?: string | null } = {}) {
    const prisma: any = {
      order: {
        findFirst: jest.fn(async ({ where }: any) =>
          where.ticketEmailMessageId
            ? opts.orderByMsg
              ? { id: 'o1' }
              : null
            : null,
        ),
        updateMany: jest.fn(async () => ({ count: 1 })),
      },
      emailDelivery: {
        findFirst: jest.fn(async () => null),
        updateMany: jest.fn(async () => ({ count: 1 })),
      },
    };
    const config: any = { get: () => SECRET };
    return { svc: new ResendWebhookService(prisma, config), prisma };
  }
  const send = (svc: ResendWebhookService, payload: object) => {
    const body = JSON.stringify(payload);
    const ts = Math.floor(Date.now() / 1000);
    return svc.handle(body, {
      id: 'm',
      timestamp: String(ts),
      signature: sign('m', ts, body),
    });
  };

  it('rejects an unsigned request', async () => {
    const { svc } = setup();
    expect(await svc.handle('{}', {})).toEqual({ status: 'unauthorized' });
  });

  it('records a bounce on the order matched by Message-ID', async () => {
    const { svc, prisma } = setup({ orderByMsg: true });
    const res = await send(svc, {
      type: 'email.bounced',
      data: {
        message_id: '<ABC@x>',
        to: ['a@b.com'],
        bounce: { type: 'Permanent', message: 'bad' },
      },
    });
    expect(res).toEqual({ status: 'recorded', target: 'order' });
    expect(
      prisma.order.findFirst.mock.calls[0][0].where.ticketEmailMessageId,
    ).toBe('abc@x');
    expect(prisma.order.updateMany.mock.calls[0][0].data.ticketEmailEvent).toBe(
      'BOUNCED',
    );
  });

  it('a late "delivered" cannot overwrite a bounce', async () => {
    const { svc, prisma } = setup({ orderByMsg: true });
    await send(svc, {
      type: 'email.delivered',
      data: { message_id: 'abc@x', to: ['a@b.com'] },
    });
    const states = prisma.order.updateMany.mock.calls[0][0].where.OR.map(
      (c: any) => c.ticketEmailEvent,
    );
    expect(states).toEqual(
      expect.arrayContaining([null, 'DELAYED', 'DELIVERED']),
    );
    expect(states).not.toContain('BOUNCED');
  });

  it('falls back to the recipient address when the id is unknown', async () => {
    const { svc, prisma } = setup();
    prisma.order.findFirst.mockImplementation(async ({ where }: any) =>
      where.attendeeEmail ? { id: 'o9', ticketEmailSentAt: new Date() } : null,
    );
    const res = await send(svc, {
      type: 'email.complained',
      data: { message_id: 'zzz', to: ['A@B.com'] },
    });
    expect(res).toEqual({ status: 'recorded', target: 'order' });
  });

  it('reports unmatched events without failing', async () => {
    const { svc } = setup();
    expect(
      await send(svc, {
        type: 'email.bounced',
        data: { message_id: 'q', to: ['n@o.com'] },
      }),
    ).toEqual({ status: 'unmatched' });
  });
});
