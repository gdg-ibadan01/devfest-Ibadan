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

/**
 * Returns the transaction rows from a list response. Checks the known
 * envelopes first, then searches nested objects (ALATPay has returned
 * paginated shapes such as `data.result` / `value.data.records`), so an
 * unexpected envelope can't silently yield "0 transactions".
 */
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
  if (Array.isArray(body)) return body;
  return findObjectArray(body, 4) ?? [];
}

/** First array of objects within `depth` levels (breadth-first). */
function findObjectArray(root: unknown, depth: number): unknown[] | null {
  let level: unknown[] = [root];
  for (let d = 0; d <= depth && level.length > 0; d++) {
    const next: unknown[] = [];
    for (const node of level) {
      if (Array.isArray(node)) {
        if (node.length > 0 && node.every(isDict)) return node;
        continue;
      }
      if (isDict(node)) next.push(...Object.values(node));
    }
    level = next;
  }
  return null;
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

const str = (value: unknown): string | null => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
};

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
