import type { PaymentSession } from '@/app/_module/api/types';
import type { CheckoutHandlers } from './types';

interface AlatpayTransactionData {
  status?: string;
  transactionId?: string;
  reference?: string;
  customer?: { transactionId?: string };
}

/**
 * Card payments report only `{ status: true, data: 'Transaction Successful' }`
 * (no transaction id); transfers report a transaction object.
 */
interface AlatpayResponse {
  status?: boolean;
  message?: string;
  data?: AlatpayTransactionData | string;
}

interface AlatpaySetupOptions {
  apiKey: string;
  businessId: string;
  email: string;
  amount: number;
  currency: string;
  firstName: string;
  lastName: string;
  metadata: Record<string, unknown>;
  onTransaction: (response: AlatpayResponse) => void;
  onClose: () => void;
}

interface AlatpayPopup {
  show: () => void;
}

declare global {
  interface Window {
    Alatpay?: { setup: (options: AlatpaySetupOptions) => AlatpayPopup };
  }
}

const SCRIPT_LOAD_TIMEOUT_MS = 15_000;
const loaders = new Map<string, Promise<void>>();

function waitForGlobal(timeoutMs = 5_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (typeof window.Alatpay?.setup === 'function') return resolve();
      if (Date.now() - started > timeoutMs) {
        return reject(new Error('The ALATPay checkout did not initialise.'));
      }
      window.setTimeout(check, 100);
    };
    check();
  });
}

/** Loads the ALATPay checkout script once per URL (sandbox or live). */
export function loadAlatpayScript(src: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Payments are only available in the browser.'));
  }
  if (typeof window.Alatpay?.setup === 'function') return Promise.resolve();

  const cached = loaders.get(src);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const fail = (message: string) => {
      loaders.delete(src);
      reject(new Error(message));
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-alatpay-src="${src}"]`
    );
    if (existing) {
      waitForGlobal(SCRIPT_LOAD_TIMEOUT_MS).then(resolve, (e: Error) =>
        fail(e.message)
      );
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.alatpaySrc = src;
    const timer = window.setTimeout(() => {
      script.remove();
      fail('The payment window took too long to load. Please try again.');
    }, SCRIPT_LOAD_TIMEOUT_MS);
    script.onload = () => {
      window.clearTimeout(timer);
      waitForGlobal().then(resolve, (e: Error) => fail(e.message));
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      script.remove();
      fail(
        'Could not load the ALATPay checkout. Check your connection and try again.'
      );
    };
    document.body.appendChild(script);
  });

  loaders.set(src, promise);
  return promise;
}

/** Opens the ALATPay popup with the server-built config. */
export async function openAlatpayCheckout(
  session: PaymentSession,
  handlers: CheckoutHandlers
): Promise<void> {
  const cfg = session.config;
  const scriptUrl = typeof cfg.scriptUrl === 'string' ? cfg.scriptUrl : '';
  if (!scriptUrl || !cfg.apiKey || !cfg.businessId) {
    throw new Error('Payment is not available right now. Please try again shortly.');
  }

  await loadAlatpayScript(scriptUrl);

  let settled = false;
  const popup = window.Alatpay!.setup({
    apiKey: String(cfg.apiKey),
    businessId: String(cfg.businessId),
    email: String(cfg.email ?? ''),
    amount: Number(cfg.amount ?? session.amount),
    currency: String(cfg.currency ?? 'NGN'),
    firstName: String(cfg.firstName ?? ''),
    lastName: String(cfg.lastName ?? ''),
    metadata: (cfg.metadata ?? {}) as Record<string, unknown>,
    onTransaction: (response) => {
      if (settled) return;
      settled = true;
      const data =
        typeof response?.data === 'object' ? response.data : undefined;
      const transactionRef =
        data?.customer?.transactionId ?? data?.transactionId ?? data?.reference;
      const status = String(data?.status ?? '').toLowerCase();

      // No transaction status means a card payment's plain success message;
      // the API then finds the transaction by order (never trusts this alone).
      if (response?.status === true && (status === 'completed' || !status)) {
        handlers.onSuccess(transactionRef);
      } else if (['pending', 'processing', 'open', 'initiated'].includes(status)) {
        handlers.onPending(transactionRef);
      } else {
        handlers.onFailed(response?.message);
      }
    },
    onClose: () => {
      if (settled) return;
      settled = true;
      handlers.onDismiss();
    },
  });

  if (!popup || typeof popup.show !== 'function') {
    throw new Error('Could not open the ALATPay checkout. Please try again.');
  }
  popup.show();
  handlers.onOpened?.();
}
