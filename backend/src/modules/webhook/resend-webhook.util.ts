import { createHmac, timingSafeEqual } from 'crypto';

/** Webhook requests older (or newer) than this are rejected as replays. */
export const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

export interface SvixHeaders {
  id?: string;
  timestamp?: string;
  signature?: string;
}

/**
 * Verifies a Resend (Svix) webhook. Signed content is `${id}.${timestamp}.${rawBody}`,
 * HMAC-SHA256 with the base64-decoded part of the `whsec_...` secret; the
 * header lists one or more space-separated `v1,<base64>` signatures.
 */
export function verifySvixSignature(
  secret: string,
  rawBody: string | Buffer,
  headers: SvixHeaders,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  const { id, timestamp, signature } = headers;
  if (!secret || !id || !timestamp || !signature) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(nowSeconds - ts) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  const expected = createHmac('sha256', key)
    .update(`${id}.${timestamp}.${body}`)
    .digest();

  return signature.split(' ').some((part) => {
    const [version, value] = part.split(',');
    if (version !== 'v1' || !value) return false;
    const given = Buffer.from(value, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

export type EmailEventState =
  'DELIVERED' | 'DELAYED' | 'BOUNCED' | 'COMPLAINED';

/** Later states win: a bounce after "delivered" counts, "delivered" after a bounce doesn't. */
export const EVENT_RANK: Record<EmailEventState, number> = {
  DELAYED: 1,
  DELIVERED: 2,
  BOUNCED: 3,
  COMPLAINED: 4,
};

const EVENT_TYPES: Record<string, EmailEventState> = {
  'email.delivered': 'DELIVERED',
  'email.delivery_delayed': 'DELAYED',
  'email.bounced': 'BOUNCED',
  'email.suppressed': 'BOUNCED',
  'email.complained': 'COMPLAINED',
};

export interface ParsedEmailEvent {
  state: EmailEventState;
  messageId: string | null;
  to: string[];
  detail: string | null;
  occurredAt: Date;
}

/** Returns null for event types we don't track (sent, opened, clicked, ...). */
export function parseEmailEvent(payload: unknown): ParsedEmailEvent | null {
  if (!payload || typeof payload !== 'object') return null;
  const { type, created_at, data } = payload as {
    type?: string;
    created_at?: string;
    data?: Record<string, any>;
  };
  const state = type ? EVENT_TYPES[type] : undefined;
  if (!state || !data || typeof data !== 'object') return null;

  let detail: string | null = null;
  if (state === 'BOUNCED') {
    const b = data.bounce ?? {};
    detail =
      [b.type, b.subType].filter(Boolean).join('/') +
      (b.message ? `: ${b.message}` : '');
    if (!detail) detail = type === 'email.suppressed' ? 'Suppressed' : null;
  } else if (state === 'COMPLAINED') {
    detail = 'Recipient marked the email as spam';
  }

  const when = created_at ? new Date(created_at) : new Date();
  return {
    state,
    messageId: typeof data.message_id === 'string' ? data.message_id : null,
    to: Array.isArray(data.to)
      ? data.to.filter((t: unknown): t is string => typeof t === 'string')
      : [],
    detail: detail ? detail.slice(0, 500) : null,
    occurredAt: Number.isNaN(when.getTime()) ? new Date() : when,
  };
}
