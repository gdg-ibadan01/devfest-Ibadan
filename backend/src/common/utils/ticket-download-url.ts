import crypto from 'node:crypto';

export function buildSignedTicketDownloadUrl(
  reference: string,
  secret: string,
  baseUrl: string,
): string {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(reference)
    .digest('hex');

  const token = Buffer.from(`${reference}:${signature}`).toString('base64url');

  return `${baseUrl}/api/v1/tickets/download?token=${token}`;
}

/**
 * Reverse of the token in buildSignedTicketDownloadUrl: returns the order
 * reference when the HMAC matches, otherwise null. Constant-time compare.
 */
export function verifyTicketToken(
  token: string,
  secret: string,
): string | null {
  let decoded: string;
  try {
    decoded = Buffer.from(token, 'base64url').toString('utf-8');
  } catch {
    return null;
  }
  const sep = decoded.lastIndexOf(':');
  if (sep <= 0) return null;
  const reference = decoded.slice(0, sep);
  const signature = decoded.slice(sep + 1);
  const expected = crypto
    .createHmac('sha256', secret)
    .update(reference)
    .digest('hex');
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }
  return reference;
}

/**
 * Pull the signed token out of whatever a QR scanner returns: the full
 * download URL (`…/tickets/download?token=…`) or the bare token.
 */
export function extractTicketToken(scanned: string): string | null {
  const value = scanned.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      return new URL(value).searchParams.get('token');
    } catch {
      return null;
    }
  }
  const match = value.match(/[?&]token=([A-Za-z0-9_-]+)/);
  if (match) return match[1];
  return /^[A-Za-z0-9_-]{40,}$/.test(value) ? value : null;
}
