'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarPlus,
  Check,
  Download,
  Loader2,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '../_module/lib/utils';
import SessionBadge from '../agenda/components/SessionBadge';
import { SESSION_TYPE_LABEL } from '../agenda/components/agendaConstants';
import {
  buildIcs,
  googleCalendarUrl,
  type Pick,
  type SessionType,
} from './pick';

const PRESETS = [
  {
    label: 'Flutter & Mobile AI',
    text: 'I build cross-platform apps with Flutter and want to add AI features like Gemini safely.',
  },
  {
    label: 'AI Agents & PyTorch',
    text: 'I am an ML engineer working with PyTorch and LLMs, and I want to build multi-agent systems.',
  },
  {
    label: 'Cloud, gRPC & Privacy',
    text: 'I am a backend engineer working on distributed systems and cloud, and I care about data privacy.',
  },
  {
    label: 'Product Design & Vibe Lounge',
    text: 'I am a product designer curious about how AI changes design and motion, and I’d like some hands-on build time with other attendees.',
  },
  {
    label: 'Founders, Career & Wellness',
    text: 'I am a founder thinking about my tech career, personal brand and avoiding burnout.',
  },
];

const TYPES = Object.keys(SESSION_TYPE_LABEL) as SessionType[];

// Same pill buttons as the rest of the site (see not-found.tsx, EmptyTicketState.tsx).
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-core-blue';
const pillPrimary = cn(
  'inline-flex items-center justify-center gap-2 rounded-[100px] bg-[#1E1E1E] text-white font-semibold text-sm px-5 py-2.5 transition-colors hover:bg-core-blue disabled:opacity-40 disabled:hover:bg-[#1E1E1E] disabled:cursor-not-allowed',
  focusRing
);
const pillSecondary = cn(
  'inline-flex items-center justify-center gap-2 rounded-[100px] bg-white text-[#1E1E1E] border-2 border-[#1E1E1E] font-medium text-sm px-4 py-2 transition-colors hover:bg-[#FFE7A5] disabled:opacity-40 disabled:cursor-not-allowed',
  focusRing
);

type Turn = {
  text: string;
  state: 'loading' | 'done' | 'error';
  message?: string;
  status?: 'ok' | 'needs_more';
  unsure?: boolean;
  nearby?: boolean;
  picks?: Pick[];
};

export default function ConciergeView() {
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [types, setTypes] = useState<SessionType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const busy = turns.at(-1)?.state === 'loading';

  useEffect(() => {
    if (turns.length)
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [turns]);

  const update = (i: number, patch: Partial<Turn>) =>
    setTurns((t) =>
      t.map((turn, j) => (j === i ? { ...turn, ...patch } : turn))
    );

  async function suggest(text: string) {
    const description = text.trim();
    if (!description || busy) return;
    const i = turns.length;
    setTurns((t) => [...t, { text: description, state: 'loading' }]);
    setInput('');
    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, types }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message);
      update(i, { state: 'done', ...data });
    } catch (err) {
      update(i, {
        state: 'error',
        message:
          (err as Error).message || 'Something went wrong. Please try again.',
      });
    }
  }

  const toggleType = (t: SessionType) =>
    setTypes((cur) =>
      cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]
    );

  return (
    <div className="bg-white min-h-[100vh] pt-[120px] md:pt-[160px] pb-[100px] px-4 font-sans">
      <div className="mx-auto max-w-[900px]">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] lg:text-[44px] font-medium text-[#1E1E1E] leading-tight">
              Session Concierge
            </h1>
            <p className="text-base md:text-lg text-[#555] mt-1 max-w-[52ch]">
              Describe what you build and get personalized talks & workshops for
              DevFest Ibadan 2026.
            </p>
          </div>
          <Link
            href="/agenda"
            className={cn(pillSecondary, 'self-start sm:self-auto shrink-0')}
          >
            Full schedule <ArrowRight size={16} aria-hidden />
          </Link>
        </header>

        <section className="flex flex-col bg-white border-[2px] border-[#1E1E1E] shadow-[6px_6px_0px_#1E1E1E] min-h-[60vh]">
          <div className="grid grid-cols-4 h-1.5" aria-hidden>
            <span className="bg-core-blue" />
            <span className="bg-core-red" />
            <span className="bg-core-yellow" />
            <span className="bg-[#34A853]" />
          </div>

          <div
            className="flex-1 px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6"
            aria-live="polite"
          >
            <div>
              <p className="text-[17px] md:text-[20px] text-[#1E1E1E] leading-relaxed max-w-[60ch]">
                Welcome to DevFest Ibadan 2026! Share what you do, the tools you
                use and what you’d like to learn, and I’ll build you a
                clash-free plan of talks and workshops from across our halls.
              </p>
              <p className="text-sm text-[#555] mt-5 mb-3">
                Try a quick introduction or write your own below:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    disabled={busy}
                    onClick={() => suggest(p.text)}
                    className={pillSecondary}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {turns.map((turn, i) => (
              <div key={i} className="flex flex-col gap-4">
                <p className="self-end max-w-[85%] bg-[#1E1E1E] text-white rounded-[12px] px-4 py-3 text-sm md:text-base">
                  {turn.text}
                </p>
                <Reply turn={turn} />
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              suggest(input);
            }}
            className="border-t-[2px] border-[#1E1E1E] p-3 md:p-4 bg-[#FAF8F5]"
          >
            <div className="bg-white border-[2px] border-[#1E1E1E] rounded-[12px] p-3 focus-within:border-core-blue transition-colors">
              <label htmlFor="concierge-input" className="sr-only">
                Tell me about yourself
              </label>
              <textarea
                id="concierge-input"
                rows={2}
                maxLength={1500}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    suggest(input);
                  }
                }}
                placeholder="Tell me about yourself and the kinds of talks you want at DevFest Ibadan…"
                className="w-full resize-none outline-none text-[16px] text-[#1E1E1E] placeholder:text-[#767676] caret-core-blue"
              />
              {showFilters && (
                <fieldset className="flex flex-wrap items-center gap-2 mb-3 border-t border-[#E4E4E4] pt-3">
                  <legend className="float-left mr-1 text-sm text-[#555]">
                    Show only:
                  </legend>
                  {TYPES.map((t) => {
                    const on = types.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleType(t)}
                        className={cn(
                          'inline-flex items-center gap-1 px-3 py-1 rounded-2xl border text-sm font-medium transition-colors',
                          focusRing,
                          on
                            ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                            : 'bg-white border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#FFE7A5]'
                        )}
                      >
                        {on && <Check size={14} aria-hidden />}
                        {SESSION_TYPE_LABEL[t]}
                      </button>
                    );
                  })}
                  {types.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTypes([])}
                      className={cn(
                        'text-sm font-medium text-[#1E1E1E] underline underline-offset-2 hover:text-core-blue',
                        focusRing
                      )}
                    >
                      Clear
                    </button>
                  )}
                </fieldset>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-expanded={showFilters}
                  onClick={() => setShowFilters((v) => !v)}
                  className={pillSecondary}
                >
                  <SlidersHorizontal size={16} aria-hidden />
                  Filters{types.length ? ` (${types.length})` : ''}
                </button>
                <span className="hidden sm:inline text-sm text-[#767676]">
                  Press Enter to send
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className={cn(pillPrimary, 'ml-auto')}
                >
                  {busy ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden />
                  ) : (
                    <Send size={16} aria-hidden />
                  )}
                  Suggest
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function downloadPlan(picks: Pick[]) {
  const ics = buildIcs(picks.map((p) => p.session));
  const url = URL.createObjectURL(
    new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'devfest-ibadan-2026-plan.ics';
  a.click();
  // Revoking synchronously can cancel the download in Safari.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Reply({ turn }: Readonly<{ turn: Turn }>) {
  const note = 'text-[#1E1E1E] text-base max-w-[60ch]';

  if (turn.state === 'loading') {
    return (
      <p className="flex items-center gap-2 text-[#555]">
        <Loader2 size={16} className="animate-spin" aria-hidden /> Reading the
        schedule for you…
      </p>
    );
  }
  if (turn.state === 'error') {
    return (
      <p role="alert" className="text-[#C5221F] font-medium">
        {turn.message}
      </p>
    );
  }
  if (turn.status === 'needs_more') {
    return (
      <p className={note}>
        Tell me a bit more—what do you build, which tools do you use, or what do
        you want to learn?
      </p>
    );
  }
  if (!turn.picks?.length) {
    return (
      <p className={note}>
        Nothing on the schedule is a strong match for that. Try clearing filters
        or browse the{' '}
        <Link
          href="/agenda"
          className="font-medium underline underline-offset-2 hover:text-core-blue"
        >
          full schedule
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className={note}>
        {turn.nearby
          ? 'Nothing on the schedule is squarely about that, but these are the closest matches.'
          : `Here’s your DevFest plan—${turn.picks.length} session${turn.picks.length > 1 ? 's' : ''}, no clashes.`}
        {turn.unsure && ' Tell me more about your work for sharper picks.'}
      </p>

      <ol className="flex flex-col gap-3">
        {turn.picks.map(({ session, fit, alsoRunning }) => (
          <li
            key={session.id}
            className="border-[2px] border-[#1E1E1E] bg-white p-4 flex flex-col gap-2"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#1E1E1E] bg-white border border-[#1E1E1E] px-3 py-1 rounded-2xl tabular-nums">
                {session.time}
              </span>
              <span className="text-xs font-medium text-[#555]">
                {session.hall}
              </span>
              {fit === 'must' && (
                <span className="text-xs font-semibold bg-[#1E1E1E] text-white px-2 py-0.5 rounded">
                  Must attend
                </span>
              )}
            </div>
            <div>
              <SessionBadge type={session.type} />
              <p className="font-semibold text-[#1E1E1E] leading-snug">
                {session.title}
              </p>
              {session.speaker && (
                <p className="text-[#555] text-sm mt-0.5">{session.speaker}</p>
              )}
              {session.track && (
                <p className="text-[#666] text-xs mt-0.5">{session.track}</p>
              )}
            </div>
            {alsoRunning.length > 0 && (
              <p className="text-xs text-[#555] border-t border-[#E4E4E4] pt-2">
                Also running at this time:{' '}
                {alsoRunning.map((s) => `${s.title} (${s.hall})`).join('; ')}
              </p>
            )}
            <a
              href={googleCalendarUrl(session)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'self-start inline-flex items-center gap-1.5 text-sm font-medium text-[#1E1E1E] underline underline-offset-2 hover:text-core-blue',
                focusRing
              )}
            >
              <CalendarPlus size={15} aria-hidden />
              Add to Google Calendar
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ol>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => downloadPlan(turn.picks!)}
          className={cn(pillPrimary, 'self-start')}
        >
          <Download size={16} aria-hidden />
          Add all to calendar
        </button>
        <span className="text-sm text-[#555]">
          Downloads a .ics file for Apple, Outlook or Google Calendar.
        </span>
      </div>
    </div>
  );
}
