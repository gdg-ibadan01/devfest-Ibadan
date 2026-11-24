import { TARGET_DATE } from '@/app/_module/data/devfest-hero.data';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * True once DevFest is over (the morning after the event). Set
 * NEXT_PUBLIC_POST_EVENT_MODE to "true" or "false" to force either state.
 */
function resolveEventEnded() {
  const override = process.env.NEXT_PUBLIC_POST_EVENT_MODE;
  if (override === 'true') return true;
  if (override === 'false') return false;
  return Date.now() > TARGET_DATE + DAY_MS;
}

export const EVENT_ENDED = resolveEventEnded();
