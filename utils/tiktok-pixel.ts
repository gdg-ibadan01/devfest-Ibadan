export const TIKTOK_PIXEL_ID =
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID !== undefined
    ? process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
    : 'DB73SMBC77U3SVPIJMP0';

declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (
        event: string,
        options?: Record<string, unknown>,
        extraConfig?: Record<string, unknown>
      ) => void;
      [key: string]: unknown;
    };
  }
}

const pendingEvents: [
  string,
  Record<string, unknown>?,
  Record<string, unknown>?,
][] = [];
const trackedEvents = new Set<string>();

export function flushTikTokPixelEvents() {
  if (
    typeof window === 'undefined' ||
    !window.ttq ||
    typeof window.ttq.track !== 'function'
  )
    return;
  while (pendingEvents.length) {
    const next = pendingEvents[0];
    if (!next) break;
    const [event, options, extraConfig] = next;
    window.ttq.track(event, options, extraConfig);
    pendingEvents.shift();
  }
}

export function ttqTrack(
  event: string,
  options?: Record<string, unknown>,
  extraConfig?: Record<string, unknown>
) {
  if (typeof window === 'undefined' || !TIKTOK_PIXEL_ID) return false;
  pendingEvents.push([event, options, extraConfig]);
  flushTikTokPixelEvents();
  return true;
}

export interface TicketEvent {
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

  const value = Number(order.amount.toFixed(2));
  const price = Number((order.amount / order.quantity).toFixed(2));
  const ticketName = order.ticketType || 'DevFest Ibadan Ticket';

  return {
    value,
    currency: 'NGN',
    content_name: ticketName,
    content_type: 'product',
    quantity: order.quantity,
    contents: [
      {
        content_id: order.ticketType || 'devfest_ticket',
        content_name: ticketName,
        content_type: 'product',
        quantity: order.quantity,
        price,
      },
    ],
  };
}

export function trackInitiateCheckout(order: TicketEvent) {
  const options = eventOptions(order);
  if (options) ttqTrack('InitiateCheckout', options);
}

/** Call only for an order confirmed PAID by the backend. */
export function trackPurchase(order: TicketEvent & { reference: string }) {
  if (typeof window === 'undefined') return;
  const reference = order.reference.trim();
  const options = eventOptions(order);
  if (!reference || !options) return;

  for (const [event, prefix] of [
    ['CompletePayment', 'tt_payment'],
    ['PlaceAnOrder', 'tt_order'],
  ]) {
    const key = `${prefix}_${reference}`;
    if (trackedEvents.has(key)) continue;
    try {
      if (window.sessionStorage.getItem(key)) continue;
    } catch {
      // Storage can be unavailable; retain in-memory deduplication.
    }

    if (
      !ttqTrack(
        event,
        { ...options, order_id: reference },
        { event_id: reference }
      )
    )
      continue;
    trackedEvents.add(key);
    try {
      window.sessionStorage.setItem(key, '1');
    } catch {
      // Tracking must not interrupt payment confirmation when storage is blocked.
    }
  }
}
