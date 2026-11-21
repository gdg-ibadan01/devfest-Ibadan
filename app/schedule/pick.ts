// Pure decision logic for the Session Concierge. No imports so it runs under `node --test`.

export type SessionType = 'session' | 'lightning' | 'workshop' | 'vibe';

export type ConciergeSession = {
  id: string;
  title: string;
  speaker?: string;
  track?: string;
  type: SessionType;
  hall: string;
  time: string;
};

// From a Jev Score over FIT_LEVELS (questions.ts): `score` is the expected level (0..3),
// `near` is P(level 1 or more), `good` is P(level 2 or 3), `must` is P(level 3).
export type FitAnswer = {
  score: number;
  near: number;
  good: number;
  must: number;
};

export type Fit = 'must' | 'good';

export type Pick = {
  session: ConciergeSession;
  fit: Fit;
  // Sessions the attendee would also like but that clash with this one.
  alsoRunning: ConciergeSession[];
};

// Gate on probabilities, not the expected score: the score drifts to the middle when Jev is torn.
export const GOOD_FIT = 0.5;
export const MUST_ATTEND = 0.5;
// Fallback when nothing fits: sessions Jev is fairly sure are at least in a neighbouring field.
export const NEARBY = 0.7;
const MAX_NEARBY = 3;

const toMinutes = (clock: string) => {
  const m = clock.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) throw new Error(`Bad time: ${clock}`);
  const h = (Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  return h * 60 + Number(m[2]);
};

export const timeRange = (time: string) => {
  const [start, end] = time.split(' - ').map(toMinutes);
  return { start, end };
};

const overlaps = (a: ConciergeSession, b: ConciergeSession) => {
  const x = timeRange(a.time);
  const y = timeRange(b.time);
  return x.start < y.end && y.start < x.end;
};

/**
 * Keep sessions that fit, then build a clash-free day: the best-fitting session wins its
 * time slot and clashing good fits are listed under it as "also running".
 * One Vibe Lounge visit is enough, so later lounge slots are dropped.
 */
export function pickSessions(
  sessions: ConciergeSession[],
  fits: Record<string, FitAnswer>,
  types?: SessionType[]
): Pick[] {
  const candidates = sessions
    .filter((s) => !types?.length || types.includes(s.type))
    .filter((s) => (fits[s.id]?.good ?? 0) >= GOOD_FIT)
    .sort((a, b) => fits[b.id].score - fits[a.id].score);

  const picks: Pick[] = [];
  for (const session of candidates) {
    const clash = picks.find((p) => overlaps(p.session, session));
    if (session.type === 'vibe' && picks.some((p) => p.session.type === 'vibe'))
      continue;
    if (clash) {
      // Name the lounge once, not once per slot.
      const listed = clash.alsoRunning.some((x) => x.type === 'vibe');
      if (session.type !== 'vibe' || !listed) clash.alsoRunning.push(session);
      continue;
    }
    picks.push({
      session,
      fit: fits[session.id].must >= MUST_ATTEND ? 'must' : 'good',
      alsoRunning: [],
    });
  }
  return picks.sort(
    (a, b) => timeRange(a.session.time).start - timeRange(b.session.time).start
  );
}

/** When nothing fits directly, offer up to three of the closest sessions instead of an empty plan. */
export function closestMatches(
  sessions: ConciergeSession[],
  fits: Record<string, FitAnswer>,
  types?: SessionType[]
): Pick[] {
  const top = sessions
    .filter(
      (s) => s.type !== 'vibe' && (!types?.length || types.includes(s.type))
    )
    .filter((s) => (fits[s.id]?.near ?? 0) >= NEARBY)
    .sort((a, b) => fits[b.id].score - fits[a.id].score)
    .slice(0, MAX_NEARBY);
  return pickSessions(
    top,
    Object.fromEntries(
      top.map((s) => [s.id, { ...fits[s.id], good: 1, must: 0 }])
    )
  );
}

/**
 * The plan the route returns. Closest matches only when nothing fits at all: if good fits
 * exist but the format filter hides them, return none so the page can say "clear filters".
 */
export function planFor(
  sessions: ConciergeSession[],
  fits: Record<string, FitAnswer>,
  types: SessionType[]
) {
  const picks = pickSessions(sessions, fits, types);
  const anyFit = picks.length > 0 || pickSessions(sessions, fits).length > 0;
  return anyFit
    ? { nearby: false, picks }
    : { nearby: true, picks: closestMatches(sessions, fits, types) };
}

// ── Calendar ────────────────────────────────────────────────────────────────
// Event day and venue match app/_module/config/seo.ts. Lagos is UTC+1 all year (no DST).
export const EVENT_DAY = '2026-11-21';
export const VENUE = 'Kakanfo Inn & Conference Centre, Ring Road, Ibadan';
const LAGOS_OFFSET_MIN = 60;

const utcStamp = (minutesInLagos: number) => {
  const d = new Date(`${EVENT_DAY}T00:00:00Z`);
  d.setUTCMinutes(minutesInLagos - LAGOS_OFFSET_MIN);
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
};

export const eventTimes = (s: ConciergeSession) => {
  const { start, end } = timeRange(s.time);
  return { start: utcStamp(start), end: utcStamp(end) };
};

const details = (s: ConciergeSession) =>
  [
    s.speaker && `Speaker: ${s.speaker}`,
    s.track,
    `Full schedule: https://devfestibadan.com/agenda`,
  ]
    .filter(Boolean)
    .join('\n');

export function googleCalendarUrl(s: ConciergeSession) {
  const { start, end } = eventTimes(s);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${s.title} · DevFest Ibadan`,
    dates: `${start}/${end}`,
    details: details(s),
    location: `${s.hall}, ${VENUE}`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

const icsText = (v: string) =>
  v
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

// RFC 5545: lines of at most 75 octets; continuation lines start with a space.
const fold = (line: string) => {
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = '';
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  return [...out, cur].join('\r\n ');
};

export function buildIcs(sessions: ConciergeSession[], now = new Date()) {
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
  const events = sessions.flatMap((s) => {
    const { start, end } = eventTimes(s);
    return [
      'BEGIN:VEVENT',
      `UID:${EVENT_DAY}-${start}-${s.id}@devfestibadan.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${icsText(`${s.title} · DevFest Ibadan`)}`,
      `LOCATION:${icsText(`${s.hall}, ${VENUE}`)}`,
      `DESCRIPTION:${icsText(details(s))}`,
      'END:VEVENT',
    ];
  });
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GDG Ibadan//DevFest Ibadan 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ]
    .map(fold)
    .join('\r\n');
}
