/**
 * Event-day date helpers.
 *
 * Ticket `validityDates` / `eventDates` are stored as UTC midnight of the
 * calendar day (the API accepts `YYYY-MM-DD`, which `new Date()` parses as UTC).
 * Check-ins are real instants. "Today" for check-in purposes is the calendar
 * day at the venue, not the server's local day — so both sides are reduced to
 * a `YYYY-MM-DD` key before comparing, independent of the server's TZ.
 */
export const EVENT_TIMEZONE = process.env.EVENT_TIMEZONE || 'Africa/Lagos';

const eventDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: EVENT_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Calendar day (YYYY-MM-DD) of an instant, as seen at the venue. */
export function toEventDayKey(instant: Date): string {
  return eventDayFormatter.format(instant);
}

/** Calendar day (YYYY-MM-DD) of a stored date-only value (UTC midnight). */
export function toStoredDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today's calendar day at the venue. */
export function eventToday(now: Date = new Date()): string {
  return toEventDayKey(now);
}
