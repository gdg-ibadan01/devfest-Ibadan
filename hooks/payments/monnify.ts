import Monnify from 'monnify-ts';
import type { PaymentSession } from '@/app/_module/api/types';
import type { CheckoutHandlers } from './types';

interface MonnifyResponse {
  amount: number;
  amountPaid: number;
  completed: boolean;
  completedOn: string;
  createdOn: string;
  currencyCode: string;
  customerEmail: string;
  customerName: string;
  fee: number;
  metaData: Record<string, any>;
  payableAmount: number;
  paymentMethod: string;
  paymentReference: string;
  /** e.g. 'PAID', 'PENDING', 'FAILED' */
  paymentStatus: string;
  transactionReference: string;
}

/** Opens the Monnify inline checkout with the server-built config. */
export function openMonnifyCheckout(
  session: PaymentSession,
  handlers: CheckoutHandlers
): Promise<void> {
  const cfg = session.config;
  // Server config first; legacy NEXT_PUBLIC_* env vars as a fallback.
  const apiKey = String(cfg.apiKey ?? process.env.NEXT_PUBLIC_MONNIFY_API_KEY ?? '');
  const contractCode = String(
    cfg.contractCode ?? process.env.NEXT_PUBLIC_MONIFY_CONTRACT_CODE ?? ''
  );
  if (!apiKey || !contractCode) {
    return Promise.reject(
      new Error('Payment is not available right now. Please try again shortly.')
    );
  }

  let settled = false;
  const monnify = new Monnify(apiKey, contractCode);

  monnify.initializePayment({
    amount: Number(cfg.amount ?? session.amount),
    currency: 'NGN',
    reference: String(cfg.reference ?? session.reference),
    customerFullName: String(cfg.customerFullName ?? ''),
    customerEmail: String(cfg.customerEmail ?? ''),
    paymentDescription: String(cfg.paymentDescription ?? 'Ticket purchase'),
    metadata: (cfg.metadata ?? {}) as Record<string, any>,
    onComplete: (response: MonnifyResponse) => {
      if (settled) return;
      settled = true;
      const status = String(response?.paymentStatus ?? '').toUpperCase();
      if ((status === 'PAID' || status === 'OVERPAID') && response.transactionReference) {
        handlers.onSuccess(response.transactionReference);
      } else if (status === 'PENDING') {
        handlers.onPending(response.transactionReference);
      } else {
        handlers.onFailed();
      }
    },
    onClose: () => {
      if (settled) return;
      settled = true;
      handlers.onDismiss();
    },
    onLoadComplete: () => {
      handlers.onOpened?.();
    },
    onLoadStart: () => {},
  });

  return Promise.resolve();
}
