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
