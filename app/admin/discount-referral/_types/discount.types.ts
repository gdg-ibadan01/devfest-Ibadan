// Real API shape (see `CreateDiscountDto` / `DiscountListItemDto` in
// app/_module/api/types.ts) — matches the Discounts module of the backend
// exactly. There is no "applies to all tickets" option: `ticketSlugs` is
// always required.

export type DiscountKind = 'SINGLE' | 'BULK';

export interface CreateDiscountForm {
  name: string;
  type: DiscountKind;
  /** Naira amount, raw numeric string (e.g. "1000" or "1000.50") */
  amount: string;
  /** Selected ticket slugs this discount applies to */
  ticketSlugs: string[];
  /** Raw numeric string; required by the API */
  limit: string;
  /** YYYY-MM-DD */
  validFrom: string;
  /** YYYY-MM-DD */
  validTo: string;
  forFirstTimersOnly: boolean;
  /** Comma/newline-separated emails; required for BULK */
  recipientEmails: string;
}
