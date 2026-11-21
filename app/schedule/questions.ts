// All Jev question wording and thresholds for the Session Concierge live here.
import { SESSION_TYPE_LABEL } from '../agenda/components/agendaConstants';
import type { ConciergeSession, FitAnswer } from './pick';

export type JevAnswers = Record<
  string,
  { noul?: number; score?: number; probabilities?: Record<string, number> }
>;

export const TYPESAFE_MODEL = 'jev-latest';

// Score levels 0..3; GOOD_FIT / MUST_ATTEND in pick.ts read positions on this scale.
export const FIT_LEVELS = [
  'The session is about a field the attendee does not work in and did not ask about',
  'The session is in a field next to the attendee’s work, sharing a few tools or ideas with it',
  'The session covers a topic the attendee works on or said they want to learn',
  'The session is about the attendee’s main stack, role or stated goal',
];

// Noul thresholds for "did they tell us enough to recommend anything?"
export const DESCRIBED_YES = 0.7;
export const DESCRIBED_NO = 0.3;
// Lounge slots differ only by host, so Jev can't score them; one attendee-level question decides instead.
export const WANTS_LOUNGE_YES = 0.7;

const describe = (s: ConciergeSession) =>
  [
    `Session: ${s.title}`,
    s.speaker && `Speaker: ${s.speaker}`,
    s.track && `Topics: ${s.track}`,
    `Format: ${SESSION_TYPE_LABEL[s.type]}`,
  ]
    .filter(Boolean)
    .join('\n');

export function buildRequest(attendee: string, sessions: ConciergeSession[]) {
  const questions: Record<string, unknown> = {
    described: {
      type: 'noul',
      instructions:
        'Does `attendee` say what they work on or what they want to learn?',
      criteria: {
        true: 'The attendee names a role, a technology, a field or a topic they care about',
        false:
          'The message is a greeting, random characters or a question about the event with no interests in it',
      },
    },
    wants_lounge: {
      type: 'noul',
      instructions:
        'Does `attendee` say they want hands-on time building projects alongside other attendees?',
      criteria: {
        true: 'The attendee asks for build time, hacking, pairing or making something live at the event',
        false: 'The attendee only mentions talks, topics or their job',
      },
    },
  };
  for (const s of sessions.filter((x) => x.type !== 'vibe')) {
    questions[s.id] = {
      type: 'score',
      instructions: `How useful is this DevFest Ibadan session to the attendee described in \`attendee\`?\n\n${describe(s)}`,
      criteria: FIT_LEVELS,
    };
  }
  return { model: TYPESAFE_MODEL, state: { attendee }, questions };
}

/** Turn Jev's answers into per-session fits, or null if any answer is missing. */
export function readFits(answers: JevAnswers, sessions: ConciergeSession[]) {
  const wantsLounge = answers.wants_lounge?.noul;
  if (
    typeof answers.described?.noul !== 'number' ||
    typeof wantsLounge !== 'number'
  )
    return null;

  const fits: Record<string, FitAnswer> = {};
  for (const s of sessions) {
    if (s.type === 'vibe') {
      // They asked to build: the lounge beats good-fit talks in a clash, but not must-attends.
      fits[s.id] =
        wantsLounge >= WANTS_LOUNGE_YES
          ? { score: 2.5, near: 1, good: 1, must: 0 }
          : { score: 0, near: 0, good: 0, must: 0 };
      continue;
    }
    const a = answers[s.id];
    const p = a?.probabilities;
    if (typeof a?.score !== 'number' || !p) return null;
    fits[s.id] = {
      score: a.score,
      near: 1 - (p['0'] ?? 0),
      good: (p['2'] ?? 0) + (p['3'] ?? 0),
      must: p['3'] ?? 0,
    };
  }
  return { described: answers.described.noul, fits };
}
