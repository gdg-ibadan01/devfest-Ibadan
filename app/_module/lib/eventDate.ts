/**
 * Venue-day helpers. Must match the backend's EVENT_TIMEZONE
 * (backend/src/common/utils/event-date.ts) so "checked in today" means the
 * same thing in the UI as in the check-in API.
 */
export const EVENT_TIMEZONE = 'Africa/Lagos';

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: EVENT_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('en-NG', {
  timeZone: EVENT_TIMEZONE,
  hour: 'numeric',
  minute: '2-digit',
});

/** YYYY-MM-DD of an instant at the venue. */
export function eventDayKey(instant: Date | string): string {
  return dayFormatter.format(
    typeof instant === 'string' ? new Date(instant) : instant
  );
}

export function eventToday(): string {
  return eventDayKey(new Date());
}

/** True when any check-in falls on today (venue time). */
export function isCheckedInToday(
  checkIns: readonly string[] | undefined
): boolean {
  const today = eventToday();
  return (checkIns ?? []).some((c) => eventDayKey(c) === today);
}

/** "9:41 AM" at the venue. */
export function formatEventTime(instant: Date | string): string {
  return timeFormatter.format(
    typeof instant === 'string' ? new Date(instant) : instant
  );
}
