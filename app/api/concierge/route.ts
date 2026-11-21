import { NextRequest, NextResponse } from 'next/server';
import { SESSION_TYPE_LABEL } from '@/app/agenda/components/agendaConstants';
import { CONCIERGE_SESSIONS } from '@/app/schedule/sessions';
import {
  buildRequest,
  DESCRIBED_NO,
  DESCRIBED_YES,
  readFits,
  type JevAnswers,
} from '@/app/schedule/questions';
import { planFor, type SessionType } from '@/app/schedule/pick';

const MAX_CHARS = 1500;
const TYPES = Object.keys(SESSION_TYPE_LABEL) as SessionType[];

// POST /api/concierge  { description, types? }  →  personalised session picks
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const description =
    typeof body?.description === 'string' ? body.description.trim() : '';
  const types = Array.isArray(body?.types)
    ? (body.types as unknown[]).filter((t): t is SessionType =>
        TYPES.includes(t as SessionType)
      )
    : [];

  if (description.length < 3 || description.length > MAX_CHARS) {
    return NextResponse.json(
      { message: `Tell us about yourself in 3–${MAX_CHARS} characters.` },
      { status: 400 }
    );
  }

  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) {
    console.error('[concierge] TYPESAFE_API_KEY is not set');
    return NextResponse.json(
      { message: 'Concierge is not configured.' },
      { status: 503 }
    );
  }

  const payload = buildRequest(description, CONCIERGE_SESSIONS);
  let read: NonNullable<ReturnType<typeof readFits>>;
  try {
    const res = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      // Stay under Netlify's 10s synchronous function limit.
      signal: AbortSignal.timeout(9_000),
    });
    if (!res.ok) throw new Error(`TypeSafe ${res.status}: ${await res.text()}`);
    const answers: JevAnswers = (await res.json()).answers ?? {};
    const fits = readFits(answers, CONCIERGE_SESSIONS);
    if (!fits) throw new Error('Missing answers');
    read = fits;
  } catch (err) {
    // A failed call is an error, never an empty recommendation.
    // Attendee text is left out of logs on purpose.
    console.error('[concierge]', err);
    return NextResponse.json(
      { message: 'We could not get suggestions right now. Please try again.' },
      { status: 502 }
    );
  }

  const { described, fits } = read;
  if (described < DESCRIBED_NO) {
    return NextResponse.json({ status: 'needs_more', picks: [] });
  }

  return NextResponse.json({
    status: 'ok',
    // Between the thresholds: show picks but ask for more detail.
    unsure: described < DESCRIBED_YES,
    ...planFor(CONCIERGE_SESSIONS, fits, types),
  });
}
