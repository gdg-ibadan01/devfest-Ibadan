export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const pendingEvents: unknown[][] = [];
const trackedEvents = new Set<string>();

export function flushPixelEvents() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  while (pendingEvents.length) {
    window.fbq(...pendingEvents[0]);
    pendingEvents.shift();
  }
}

export function fbqTrack(
  event: string,
  options?: Record<string, unknown>,
  extraConfig?: Record<string, unknown>
) {
  if (typeof window === 'undefined' || !FB_PIXEL_ID) return false;
  const args: unknown[] = ['track', event];
  if (options) args.push(options);
  if (extraConfig) args.push(extraConfig);

  // Do not create an fbq stub here: it makes Meta's bootstrap skip loading.
  pendingEvents.push(args);
  flushPixelEvents();
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
  ) return null;

  return {
    value: Number(order.amount.toFixed(2)),
    currency: 'NGN',
    ...(order.ticketType ? { content_name: order.ticketType } : {}),
    num_items: order.quantity,
  };
}

export function trackInitiateCheckout(order: TicketEvent) {
  const options = eventOptions(order);
  if (options) fbqTrack('InitiateCheckout', options);
}

/** Call only for an order confirmed PAID by the backend. */
export function trackPurchase(order: TicketEvent & { reference: string }) {
  if (typeof window === 'undefined') return;
  const reference = order.reference.trim();
  const options = eventOptions(order);
  if (!reference || !options) return;

  for (const [event, prefix] of [
    ['Purchase', 'fb_purchase'],
    ['CompleteRegistration', 'fb_registration'],
  ]) {
    const key = `${prefix}_${reference}`;
    if (trackedEvents.has(key)) continue;
    try {
      if (window.sessionStorage.getItem(key)) continue;
    } catch {
      // Storage can be unavailable; retain in-memory deduplication.
    }

    if (!fbqTrack(event, options, { eventID: reference })) continue;
    trackedEvents.add(key);
    try {
      window.sessionStorage.setItem(key, '1');
    } catch {
      // Tracking must not interrupt payment confirmation when storage is blocked.
    }
  }
}
