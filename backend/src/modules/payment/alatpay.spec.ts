import * as crypto from 'node:crypto';
import { AlatpayService } from './alatpay.service';
import {
  normalizeAlatpayTransaction,
  splitFullName,
  unwrapEnvelope,
} from './alatpay.mapper';

const cfg = {
  env: 'sandbox' as const,
  publicKey: 'pub',
  secretKey: 'sec',
  businessId: 'biz',
  webhookSecret: 'whsec',
  orderTokenSecret: 'tok',
  orderTtlMinutes: 30,
  transactionsBaseUrl: 'https://example.test/transactions',
  scriptUrl: 'https://example.test/alatpay.js',
  reconciliationEnabled: false,
};

const service = () => new AlatpayService(cfg as never);

describe('AlatpayService webhook signature', () => {
  const body = Buffer.from(
    JSON.stringify({ status: true, data: { status: 'completed' } }),
  );
  const sign = (b: Buffer, secret = 'whsec') =>
    crypto.createHmac('sha256', secret).update(b).digest('base64');

  it('accepts a valid Base64 HMAC-SHA256 of the raw body', () => {
    expect(service().verifyWebhookSignature(body, sign(body))).toBe(true);
  });

  it('rejects a tampered body, wrong secret, or missing header', () => {
    const s = service();
    expect(s.verifyWebhookSignature(Buffer.from('{}'), sign(body))).toBe(false);
    expect(s.verifyWebhookSignature(body, sign(body, 'other'))).toBe(false);
    expect(s.verifyWebhookSignature(body, undefined)).toBe(false);
    expect(s.verifyWebhookSignature(undefined, sign(body))).toBe(false);
    expect(s.verifyWebhookSignature(body, 'not-base64!!')).toBe(false);
  });
});

describe('AlatpayService webhook IP allowlist', () => {
  it('allows everything when no allowlist is configured', () => {
    expect(service().isAllowedWebhookIp('1.2.3.4')).toBe(true);
  });

  it('enforces the allowlist when configured (IPv4-mapped IPv6 too)', () => {
    const s = new AlatpayService({
      ...cfg,
      webhookIpAllowlist: ['74.178.162.156'],
    } as never);
    expect(s.isAllowedWebhookIp('74.178.162.156')).toBe(true);
    expect(s.isAllowedWebhookIp('::ffff:74.178.162.156')).toBe(true);
    expect(s.isAllowedWebhookIp('10.0.0.1')).toBe(false);
    expect(s.isAllowedWebhookIp(undefined)).toBe(false);
  });
});

describe('AlatpayService order token', () => {
  it('validates only for the same order and reference', () => {
    const s = service();
    const token = s.signOrderToken('order-1', 'REF-1');
    expect(s.isValidOrderToken('order-1', 'REF-1', token)).toBe(true);
    expect(s.isValidOrderToken('order-2', 'REF-1', token)).toBe(false);
    expect(s.isValidOrderToken('order-1', 'REF-2', token)).toBe(false);
    expect(s.isValidOrderToken('order-1', 'REF-1', null)).toBe(false);
  });

  it('builds server-side popup config with signed metadata', async () => {
    const s = service();
    const session = await s.createCheckout({
      orderId: 'order-1',
      reference: 'REF-1',
      amount: 5000,
      customer: { fullName: 'Ada Lovelace Obi', email: 'ada@x.com' },
      description: 'Ticket',
    });
    expect(session.provider).toBe('ALATPAY');
    expect(session.config).toMatchObject({
      apiKey: 'pub',
      businessId: 'biz',
      amount: 5000,
      firstName: 'Ada',
      lastName: 'Lovelace Obi',
      metadata: {
        orderId: 'order-1',
        reference: 'REF-1',
        orderToken: s.signOrderToken('order-1', 'REF-1'),
      },
    });
    expect(JSON.stringify(session.config)).not.toContain('sec');
  });
});

describe('ALATPay payload mapping', () => {
  const callback = {
    status: true,
    message: 'Success',
    data: {
      id: 'tx-root',
      amount: 5000,
      currency: 'NGN',
      status: 'completed',
      customer: {
        transactionId: 'tx-123',
        metadata: JSON.stringify({
          orderId: 'order-1',
          reference: 'REF-1',
          orderToken: 'abc',
        }),
      },
    },
  };

  it('reads the documented callback model', () => {
    expect(normalizeAlatpayTransaction(callback)).toMatchObject({
      provider: 'ALATPAY',
      transactionRef: 'tx-123',
      status: 'COMPLETED',
      amount: 5000,
      currency: 'NGN',
      orderId: 'order-1',
      reference: 'REF-1',
      orderToken: 'abc',
    });
  });

  it('handles other envelopes and key casing', () => {
    const tx = {
      Status: 'Completed',
      Amount: '2500',
      Currency: 'ngn',
      Id: 'x',
    };
    expect(unwrapEnvelope({ Value: { Data: tx } })).toBe(tx);
    expect(normalizeAlatpayTransaction({ value: tx })).toMatchObject({
      status: 'COMPLETED',
      amount: 2500,
      currency: 'NGN',
      transactionRef: 'x',
    });
  });

  it('treats unknown or pending statuses as not completed', () => {
    expect(
      normalizeAlatpayTransaction({ data: { status: 'pending' } }).status,
    ).toBe('PENDING');
    expect(
      normalizeAlatpayTransaction({ data: { status: 'failed' } }).status,
    ).toBe('FAILED');
  });

  it('tolerates malformed metadata', () => {
    const tx = normalizeAlatpayTransaction({
      data: { status: 'completed', customer: { metadata: '{not json' } },
    });
    expect(tx.orderId).toBeNull();
  });

  it('splits names for the popup', () => {
    expect(splitFullName('Ada')).toEqual({ firstName: 'Ada', lastName: 'Ada' });
    expect(splitFullName('  Ada   Obi ')).toEqual({
      firstName: 'Ada',
      lastName: 'Obi',
    });
  });
});
