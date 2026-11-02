export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const trackedEvents = new Set<string>();

/** Admin pages live under /core and are not tracked. */
export function isAdminPath(pathname: string | null) {
  return pathname === '/core' || Boolean(pathname?.startsWith('/core/'));
}

export function gtagEvent(event: string, params?: Record<string, unknown>) {
  if (
    typeof window === 'undefined' ||
    !GA_MEASUREMENT_ID ||
    typeof window.gtag !== 'function'
  )
    return false;
  window.gtag('event', event, params);
  return true;
}

interface TicketEvent {
  /** Total order amount in Naira, including any discount. */
  amount: number;
  ticketType?: string;
  quantity: number;
}

function eventOptions(order: TicketEvent) {
  if (
    !Number.isFinite(order.amount) ||
    order.amount < 0 ||
    !Number.isInteger(order.quantity) ||
    order.quantity < 1
  )
    return null;

  return {
    currency: 'NGN',
    value: Number(order.amount.toFixed(2)),
    items: [
      {
        item_id: order.ticketType || 'devfest_ticket',
        item_name: order.ticketType || 'DevFest Ibadan Ticket',
        price: Number((order.amount / order.quantity).toFixed(2)),
        quantity: order.quantity,
      },
    ],
  };
}

export function trackInitiateCheckout(order: TicketEvent) {
  const options = eventOptions(order);
  if (options) gtagEvent('begin_checkout', options);
}

/** Call only for an order confirmed PAID by the backend. */
export function trackPurchase(order: TicketEvent & { reference: string }) {
  if (typeof window === 'undefined') return;
  const reference = order.reference.trim();
  const options = eventOptions(order);
  if (!reference || !options) return;

  const key = `ga_purchase_${reference}`;
  if (trackedEvents.has(key)) return;
  try {
    if (window.sessionStorage.getItem(key)) return;
  } catch {
    // Storage can be unavailable; retain in-memory deduplication.
  }

  if (!gtagEvent('purchase', { ...options, transaction_id: reference })) return;
  trackedEvents.add(key);
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Tracking must not interrupt payment confirmation when storage is blocked.
  }
}
