import { registerAs } from '@nestjs/config';

export const PAYMENT_PROVIDER_NAMES = ['ALATPAY', 'MONNIFY'] as const;
export type PaymentProviderName = (typeof PAYMENT_PROVIDER_NAMES)[number];

/**
 * PAYMENT_PROVIDER picks the gateway used for NEW orders (default: ALATPAY).
 * Existing orders always settle on the gateway they were created with, so the
 * value can be switched at any time without stranding in-flight payments.
 */
export default registerAs('payment', () => ({
  activeProvider: (process.env.PAYMENT_PROVIDER || 'ALATPAY')
    .trim()
    .toUpperCase(),
}));
