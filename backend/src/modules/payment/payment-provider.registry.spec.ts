// MonnifyService pulls in dinero.js (ESM-only), which Jest can't parse.
jest.mock('./monnify.service', () => ({ MonnifyService: class {} }));

import {
  ACTIVE_PROVIDER_SETTING,
  PaymentProviderRegistry,
} from './payment-provider.registry';

type Setting = {
  key: string;
  value: unknown;
  updatedById: string | null;
  updatedAt: Date;
};

function setup(
  opts: {
    env?: string;
    configured?: { ALATPAY?: boolean; MONNIFY?: boolean };
    stored?: unknown;
    dbDown?: boolean;
  } = {},
) {
  const configured = { ALATPAY: true, MONNIFY: true, ...opts.configured };
  const alatpay = { name: 'ALATPAY', isConfigured: () => configured.ALATPAY };
  const monnify = { name: 'MONNIFY', isConfigured: () => configured.MONNIFY };

  let setting: Setting | null =
    opts.stored === undefined
      ? null
      : {
          key: ACTIVE_PROVIDER_SETTING,
          value: opts.stored,
          updatedById: 'a1',
          updatedAt: new Date(),
        };
  const audit: unknown[] = [];

  const prisma = {
    appSetting: {
      findUnique: jest.fn(() =>
        opts.dbDown
          ? Promise.reject(new Error('db down'))
          : Promise.resolve(setting),
      ),
      upsert: jest.fn(
        ({ update }: { update: { value: string; updatedById: string } }) => {
          setting = {
            key: ACTIVE_PROVIDER_SETTING,
            ...update,
            updatedAt: new Date(),
          };
          return setting;
        },
      ),
    },
    admin: {
      findUnique: jest.fn(() =>
        Promise.resolve({ id: 'a1', fullName: 'Ada Admin' }),
      ),
    },
    auditLog: {
      create: jest.fn((args: { data: unknown }) => {
        audit.push(args.data);
        return args.data;
      }),
    },
    $transaction: jest.fn((ops: unknown[]) => Promise.all(ops)),
  };

  const registry = new PaymentProviderRegistry(
    monnify as never,
    alatpay as never,
    { activeProvider: opts.env ?? 'ALATPAY' },
    prisma as never,
  );
  return { registry, prisma, audit };
}

describe('PaymentProviderRegistry', () => {
  it('uses PAYMENT_PROVIDER until an admin picks a gateway', async () => {
    const { registry } = setup({ env: 'MONNIFY' });
    await registry.refresh();
    expect(registry.activeProviderName).toBe('MONNIFY');
    expect((await registry.getStatus()).source).toBe('ENV');
  });

  it("prefers the admin's saved choice over the env default", async () => {
    const { registry } = setup({ env: 'ALATPAY', stored: 'MONNIFY' });
    await registry.refresh();
    expect(registry.activeProviderName).toBe('MONNIFY');
    expect((await registry.getStatus()).source).toBe('DASHBOARD');
  });

  it('switches new orders immediately and audit-logs the change', async () => {
    const { registry, audit } = setup();
    await registry.refresh();
    const status = await registry.setActive('monnify', 'a1');

    expect(registry.active().name).toBe('MONNIFY');
    expect(status).toMatchObject({
      active: 'MONNIFY',
      source: 'DASHBOARD',
      updatedBy: { fullName: 'Ada Admin' },
    });
    expect(audit).toEqual([
      expect.objectContaining({
        action: 'SWITCH_PAYMENT_GATEWAY',
        metadata: { from: 'ALATPAY', to: 'MONNIFY' },
      }),
    ]);
  });

  it('refuses to switch to a gateway without credentials', async () => {
    const { registry, prisma } = setup({ configured: { MONNIFY: false } });
    await expect(registry.setActive('MONNIFY', 'a1')).rejects.toMatchObject({
      name: PaymentProviderRegistry.ERRORS.NotConfiguredErr,
    });
    expect(prisma.appSetting.upsert).not.toHaveBeenCalled();
    expect(registry.activeProviderName).toBe('ALATPAY');
  });

  it('rejects unknown gateways', async () => {
    const { registry } = setup();
    await expect(registry.setActive('PAYSTACK', 'a1')).rejects.toMatchObject({
      name: PaymentProviderRegistry.ERRORS.UnknownProviderErr,
    });
  });

  it('keeps the current gateway when the database is unreachable', async () => {
    const { registry } = setup({ env: 'ALATPAY', dbDown: true });
    await registry.refresh();
    expect(registry.activeProviderName).toBe('ALATPAY');
  });

  it('ignores an invalid stored value and falls back to the env default', async () => {
    const { registry } = setup({ env: 'MONNIFY', stored: 'BOGUS' });
    await registry.refresh();
    expect(registry.activeProviderName).toBe('MONNIFY');
  });

  it('falls back to a configured gateway if the saved one loses its credentials', async () => {
    const { registry } = setup({
      stored: 'MONNIFY',
      configured: { MONNIFY: false },
    });
    await registry.refresh();
    const status = await registry.getStatus();
    expect(status.selected).toBe('MONNIFY');
    expect(status.active).toBe('ALATPAY');
  });

  it('still resolves existing orders by the gateway they were created with', () => {
    const { registry } = setup();
    expect(registry.for('monnify').name).toBe('MONNIFY');
  });
});
