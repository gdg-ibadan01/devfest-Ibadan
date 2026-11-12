import { registerAs } from '@nestjs/config';

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default registerAs('alatpay', () => {
  const env: 'live' | 'sandbox' =
    (process.env.ALATPAY_ENV || 'sandbox').trim().toLowerCase() === 'live'
      ? 'live'
      : 'sandbox';
  const live = env === 'live';

  return {
    env,
    /**
     * Popup `apiKey`, and (per the ALATPay docs) the `Ocp-Apim-Subscription-Key`
     * for transaction requery.
     */
    publicKey: process.env.ALATPAY_PUBLIC_KEY?.trim(),
    /** Optional. Only tried for requery if ALATPay rejects the public key. */
    secretKey: process.env.ALATPAY_SECRET_KEY?.trim(),
    businessId: process.env.ALATPAY_BUSINESS_ID?.trim(),
    /** Verifies the `x-signature` header on callbacks (HMAC-SHA256, Base64). */
    webhookSecret: process.env.ALATPAY_WEBHOOK_SECRET?.trim(),
    /** Signs the order token we put in popup metadata. Falls back to the secret key. */
    orderTokenSecret:
      process.env.ALATPAY_ORDER_TOKEN_SECRET?.trim() ||
      process.env.ALATPAY_SECRET_KEY?.trim() ||
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
      (live
        ? 'https://apibox.alatpay.ng/alatpaytransaction/api/v1/transactions'
        : 'https://alatpay.azure-api.net/transaction/api/v1/transactions')
    ).replace(/\/+$/, ''),
    scriptUrl:
      process.env.ALATPAY_SCRIPT_URL ||
      (live
        ? 'https://web.alatpay.ng/js/alatpay.js'
        : 'https://alatpay-client.azurewebsites.net/js/alatpay.js'),
    /** Background requery of unpaid ALATPay orders (GET /transactions, per the Transaction Monitoring docs). */
    reconciliationEnabled:
      process.env.ALATPAY_RECONCILIATION_ENABLED === 'true',
  };
});
