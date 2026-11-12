'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { showToast } from '@/app/_module/lib/notify';
import { getCheckoutSession } from '@/app/_module/services/order.service';
import { confirmPayment, usePaymentLauncher } from './usePaymentLauncher';

/**
 * "Complete payment" for an existing unpaid order: fetches a fresh checkout
 * for it (on the gateway it was created with) and reopens the popup. Reusing
 * the order avoids the "you already have an order" conflict on retry.
 */
export function useResumePayment(reference: string | null) {
  const { launch } = usePaymentLauncher();
  const queryClient = useQueryClient();
  const [isResuming, setIsResuming] = useState(false);

  const refresh = useCallback(() => {
    if (!reference) return;
    void queryClient.invalidateQueries({
      queryKey: queryKeys.orders.reference(reference),
    });
  }, [queryClient, reference]);

  const resume = useCallback(async () => {
    if (!reference) return;
    setIsResuming(true);
    try {
      const session = await getCheckoutSession(reference);
      if (!session.payment) {
        refresh();
        if (session.status === 'PAID') {
          showToast.success('This order is already paid.');
        } else {
          showToast.info('This order can no longer be paid.');
        }
        return;
      }

      await launch(session.payment, {
        onOpened: () => setIsResuming(false),
        onSuccess: (transactionRef) => {
          setIsResuming(false);
          void confirmPayment(reference, transactionRef).finally(refresh);
        },
        onPending: () => {
          setIsResuming(false);
          refresh();
        },
        onDismiss: () => {
          setIsResuming(false);
          refresh();
        },
        onFailed: (message) => {
          setIsResuming(false);
          showToast.error(message || 'Payment was not completed. Please try again.');
          refresh();
        },
      });
    } catch (err) {
      showToast.error(
        (err as Error)?.message || 'Could not open the payment window.'
      );
      setIsResuming(false);
    }
  }, [launch, reference, refresh]);

  return { resume, isResuming };
}
