// Real API shape (see `CreateDiscountDto` / `DiscountListItemDto` in
// app/_module/api/types.ts) — matches the Discounts module of the backend
// exactly. There is no "applies to all tickets" option and no end date on
// the API: `ticketSlugs` is always required, and `endDate` below is kept
// purely as a client-side reference field that is never sent to the API.

export type DiscountKind = 'SINGLE' | 'BULK';

export interface CreateDiscountForm {
  name: string;
  type: DiscountKind;
  /** Naira amount, raw numeric string (e.g. "1000" or "1000.50") */
  amount: string;
  /** Selected ticket slugs this discount applies to */
  ticketSlugs: string[];
  /** Raw numeric string; required for BULK, ignored for SINGLE */
  limit: string;
  /** YYYY-MM-DD */
  validFrom: string;
  /** YYYY-MM-DD — reference only, NOT sent to the API (no end date field exists on the backend) */
  endDate: string;
  forFirstTimersOnly: boolean;
  /** Comma/newline-separated emails; required for BULK */
  recipientEmails: string;
}
