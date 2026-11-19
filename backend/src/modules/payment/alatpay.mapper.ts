import type {
  NormalizedTransaction,
  TransactionStatus,
} from './interfaces/payment-provider.interface';

/**
 * Pure helpers for ALATPay payloads. ALATPay responses vary in envelope
 * (`data`, `value`, `Value.Data`) and key casing, and return merchant
 * metadata as a JSON string at `customer.metadata`, so every read here is
 * tolerant. Kept free of Nest/axios so it is easy to unit test.
 */

type Dict = Record<string, unknown>;

const isDict = (value: unknown): value is Dict =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/** Reads a nested key, matching each segment case-insensitively. */
export function getCI(source: unknown, path: string[]): unknown {
  let cursor: unknown = source;
  for (const segment of path) {
    if (!isDict(cursor)) return undefined;
    if (segment in cursor) {
      cursor = cursor[segment];
      continue;
    }
    const key = Object.keys(cursor).find(
      (k) => k.toLowerCase() === segment.toLowerCase(),
    );
    if (key === undefined) return undefined;
    cursor = cursor[key];
  }
  return cursor;
}

/** Returns the transaction object from any of ALATPay's response envelopes. */
export function unwrapEnvelope(body: unknown): Dict {
  for (const path of [['value', 'data'], ['value'], ['data']]) {
    const candidate = getCI(body, path);
    if (isDict(candidate)) return candidate;
  }
  return isDict(body) ? body : {};
}

/** Returns the first array found in a list response. */
export function unwrapList(body: unknown): unknown[] {
  const paths = [
    ['data', 'data'],
    ['data', 'items'],
    ['data', 'transactions'],
    ['value', 'data'],
    ['data'],
    ['items'],
  ];
  for (const path of paths) {
    const candidate = getCI(body, path);
    if (Array.isArray(candidate)) return candidate;
  }
  return Array.isArray(body) ? body : [];
}

export function parseMetadata(raw: unknown): Dict {
  if (isDict(raw)) return raw;
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed: unknown = JSON.parse(raw);
      return isDict(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

const str = (value: unknown): string | null =>
  value === undefined || value === null || value === ''
    ? null
    : String(value as string);

export function extractTransactionId(tx: Dict): string | null {
  return (
    str(getCI(tx, ['customer', 'transactionId'])) ??
    str(getCI(tx, ['transactionId'])) ??
    str(getCI(tx, ['virtualAccount', 'transactionId'])) ??
    str(getCI(tx, ['reference'])) ??
    str(getCI(tx, ['id']))
  );
}

export function mapAlatpayStatus(status: unknown): TransactionStatus {
  const value = typeof status === 'string' ? status.trim().toLowerCase() : '';
  if (['completed', 'successful', 'success', 'paid'].includes(value)) {
    return 'COMPLETED';
  }
  if (
    [
      'failed',
      'cancelled',
      'canceled',
      'expired',
      'reversed',
      'declined',
    ].includes(value)
  ) {
    return 'FAILED';
  }
  return 'PENDING';
}

export function normalizeAlatpayTransaction(
  body: unknown,
): NormalizedTransaction {
  const tx = unwrapEnvelope(body);
  // Later spreads win: customer.metadata is where the popup's metadata lands.
  const metadata: Dict = {
    ...parseMetadata(getCI(tx, ['virtualAccount', 'customer', 'metadata'])),
    ...parseMetadata(getCI(tx, ['metadata'])),
    ...parseMetadata(getCI(tx, ['customer', 'metadata'])),
  };
  const amount = Number(getCI(tx, ['amount']) ?? 0);

  return {
    provider: 'ALATPAY',
    transactionRef: extractTransactionId(tx) ?? '',
    status: mapAlatpayStatus(getCI(tx, ['status'])),
    amount: Number.isFinite(amount) ? amount : 0,
    currency: (str(getCI(tx, ['currency'])) ?? 'NGN').toUpperCase(),
    orderId: str(metadata.orderId ?? metadata.order_id),
    reference: str(metadata.reference),
    orderToken: str(metadata.orderToken ?? metadata.order_token),
    paidAt: str(getCI(tx, ['updatedAt']) ?? getCI(tx, ['createdAt'])),
    description: str(getCI(tx, ['description'])),
    raw: tx,
  };
}

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? 'Customer';
  const lastName = parts.slice(1).join(' ') || firstName;
  return { firstName, lastName };
}
