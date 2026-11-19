import { registerAs } from '@nestjs/config';

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * ALATPay has one set of hosts. Test vs live is decided by the keys: test-mode
 * keys open the same popup in "Test Mode" (no real money moves).
 */
export default registerAs('alatpay', () => {
  return {
    /**
     * Popup `apiKey`, and (per the ALATPay docs) the `Ocp-Apim-Subscription-Key`
     * for transaction requery.
     */
    publicKey: process.env.ALATPAY_PUBLIC_KEY?.trim(),
    /**
     * Server-to-server key for the transaction API (verify, reconciliation).
     * The popup doesn't use it, but ALATPay rejects the public key there (401).
     */
    secretKey: process.env.ALATPAY_SECRET_KEY?.trim(),
    businessId: process.env.ALATPAY_BUSINESS_ID?.trim(),
    /** Verifies the `x-signature` header on callbacks (HMAC-SHA256, Base64). */
    webhookSecret: process.env.ALATPAY_WEBHOOK_SECRET?.trim(),
    /** Signs the order token we put in popup metadata. Defaults to the webhook secret. */
    orderTokenSecret:
      process.env.ALATPAY_ORDER_TOKEN_SECRET?.trim() ||
      process.env.ALATPAY_WEBHOOK_SECRET?.trim(),
    /**
     * Optional defence in depth on top of the signature: comma-separated IPs
     * ALATPay webhooks may come from (docs: 74.178.162.156). Empty = off.
     */
    webhookIpAllowlist: (process.env.ALATPAY_WEBHOOK_IP_ALLOWLIST ?? '')
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean),
    /** ALATPay virtual accounts stay open for 30 minutes. */
    orderTtlMinutes: positiveInt(process.env.ALATPAY_ORDER_TTL_MINUTES, 30),
    transactionsBaseUrl: (
      process.env.ALATPAY_TRANSACTIONS_BASE_URL ||
      'https://apibox.alatpay.ng/alatpaytransaction/api/v1/transactions'
    ).replace(/\/+$/, ''),
    scriptUrl:
      process.env.ALATPAY_SCRIPT_URL || 'https://web.alatpay.ng/js/alatpay.js',
    /** Background requery of unpaid ALATPay orders (GET /transactions, per the Transaction Monitoring docs). */
    reconciliationEnabled:
      process.env.ALATPAY_RECONCILIATION_ENABLED === 'true',
  };
});
