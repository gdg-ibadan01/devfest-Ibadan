'use client';

import { useCallback } from 'react';
import type { PaymentSession } from '@/app/_module/api/types';
import { verifyCheckout } from '@/app/_module/services/order.service';
import { openAlatpayCheckout } from './alatpay';
import { openMonnifyCheckout } from './monnify';
import type { CheckoutHandlers } from './types';

export type { CheckoutHandlers } from './types';

/**
 * Asks the API to confirm a popup payment. Failures are swallowed on
 * purpose: the gateway webhook confirms the order independently, and the
 * success page keeps polling.
 */
export async function confirmPayment(
  reference: string,
  transactionRef?: string
): Promise<void> {
  try {
    await verifyCheckout({ reference, transactionRef });
  } catch (err) {
    console.warn('Payment confirmation will complete via webhook:', err);
  }
}

/**
 * Opens whichever gateway the server chose for the order. The frontend never
 * decides the provider, so switching PAYMENT_PROVIDER needs no frontend change.
 */
export function usePaymentLauncher() {
  const launch = useCallback(
    (session: PaymentSession, handlers: CheckoutHandlers): Promise<void> => {
      switch (session.provider) {
        case 'ALATPAY':
          return openAlatpayCheckout(session, handlers);
        case 'MONNIFY':
          return openMonnifyCheckout(session, handlers);
        default:
          return Promise.reject(
            new Error(
              `Unsupported payment provider: ${String((session as { provider?: unknown }).provider)}`
            )
          );
      }
    },
    []
  );

  return { launch };
}
