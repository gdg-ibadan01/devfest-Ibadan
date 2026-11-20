'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Undo2,
  XCircle,
} from 'lucide-react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import { cn } from '@/app/_module/lib/utils';
import {
  useCheckInStats,
  useMyPermissions,
  useScanCheckIn,
  useUndoCheckIn,
} from '@/app/_module/services';
import { formatEventTime } from '@/app/_module/lib/eventDate';
import type { CheckInResponseDto } from '@/app/_module/api/types';
import QrScanner from '../_components/QrScanner';

type ScanResult =
  | { kind: 'ok'; data: CheckInResponseDto; at: number }
  | { kind: 'duplicate'; data: CheckInResponseDto; at: number }
  | { kind: 'error'; message: string; at: number };

const RESULT_STYLES = {
  ok: {
    box: 'border-[#34A853] bg-[#E8F5E9]',
    icon: <CheckCircle2 size={28} className="text-[#1B873B]" />,
    title: 'Checked in',
  },
  duplicate: {
    box: 'border-[#F59E0B] bg-[#FEF3C7]',
    icon: <AlertTriangle size={28} className="text-[#92400E]" />,
    title: 'Already checked in',
  },
  error: {
    box: 'border-[#EA4335] bg-[#FDECEA]',
    icon: <XCircle size={28} className="text-[#C5221F]" />,
    title: 'Not admitted',
  },
} as const;

export default function ScanPageClient() {
  const { can } = useMyPermissions();
  const canCheckIn = can('attendees.check_in');
  const { mutate: scan, isPending } = useScanCheckIn();
  const { mutate: undo, isPending: undoing } = useUndoCheckIn();
  const { data: stats } = useCheckInStats({}, { enabled: canCheckIn });

  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [code, setCode] = useState('');
  const [undoneIds, setUndoneIds] = useState<Set<string>>(new Set());

  const record = useCallback((r: ScanResult) => {
    setResult(r);
    setHistory((h) => [r, ...h].slice(0, 12));
  }, []);

  const submit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || isPending) return;
      scan(
        { code: trimmed },
        {
          onSuccess: (data) =>
            record({
              kind: data.alreadyCheckedIn ? 'duplicate' : 'ok',
              data,
              at: Date.now(),
            }),
          onError: (err) =>
            record({
              kind: 'error',
              message:
                (err as { status?: number }).status === 403
                  ? "Your role can't check attendees in."
                  : err.message || 'Could not check in this ticket',
              at: Date.now(),
            }),
        }
      );
    },
    [isPending, scan, record]
  );

  const handleUndo = (orderId: string) =>
    undo(
      { orderId },
      {
        onSuccess: () => setUndoneIds((s) => new Set(s).add(orderId)),
      }
    );

  if (!canCheckIn) {
    return (
      <AdminWrapper title="Scan tickets">
        <div className="px-5 py-16 text-center text-[14px] text-gray-500">
          Your role can view check-ins but not check attendees in. Ask an admin
          for the “Check-in attendees” permission.
        </div>
      </AdminWrapper>
    );
  }

  const style = result ? RESULT_STYLES[result.kind] : null;

  return (
    <AdminWrapper title="Scan tickets">
      <div className="mx-auto flex max-w-[720px] flex-col gap-4 px-4 py-5 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/core/checkins"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={15} /> Checkins
          </Link>
          {stats && (
            <p className="text-[13px] tabular-nums text-gray-600">
              <span className="font-semibold text-gray-900">
                {stats.checkedIn.toLocaleString('en-NG')}
              </span>{' '}
              / {stats.expected.toLocaleString('en-NG')} in today
            </p>
          )}
        </div>

        <QrScanner onScan={submit} paused={isPending} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(code);
            setCode('');
          }}
          className="flex gap-2"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Or type the ticket code (e.g. AB12CD)"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 font-mono text-[14px] uppercase tracking-wider text-gray-800 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            type="submit"
            disabled={isPending || code.trim().length < 4}
            className="rounded-md bg-gray-900 px-5 text-[13px] font-semibold text-white disabled:opacity-50"
          >
            Check in
          </button>
        </form>

        <div aria-live="assertive" className="min-h-[96px]">
          {isPending ? (
            <div className="flex h-[96px] items-center justify-center gap-2 rounded-[14px] border border-gray-200 bg-white text-[14px] text-gray-500">
              <Loader2 size={18} className="animate-spin" /> Checking ticket…
            </div>
          ) : result && style ? (
            <div
              className={cn(
                'flex items-start gap-3 rounded-[14px] border-2 px-5 py-4',
                style.box
              )}
            >
              {style.icon}
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-bold text-gray-900">
                  {style.title}
                </p>
                {result.kind === 'error' ? (
                  <p className="mt-0.5 text-[14px] text-gray-800">
                    {result.message}
                  </p>
                ) : (
                  <>
                    <p className="mt-0.5 truncate text-[18px] font-semibold text-gray-900">
                      {result.data.attendeeFullName}
                    </p>
                    <p className="truncate text-[13px] text-gray-700">
                      {result.data.ticketName} ·{' '}
                      <span className="font-mono">{result.data.code}</span>
                      {result.kind === 'duplicate' &&
                        ` · first in at ${formatEventTime(result.data.checkedInAt)}`}
                    </p>
                  </>
                )}
              </div>
              {result.kind === 'ok' &&
                (undoneIds.has(result.data.orderId) ? (
                  <span className="text-[12px] font-medium text-gray-600">
                    Undone
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUndo(result.data.orderId)}
                    disabled={undoing}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 disabled:opacity-50"
                  >
                    <Undo2 size={13} /> Undo
                  </button>
                ))}
            </div>
          ) : (
            <p className="flex h-[96px] items-center justify-center rounded-[14px] border border-dashed border-gray-300 text-[13px] text-gray-500">
              Point the camera at the QR code on the attendee’s ticket.
            </p>
          )}
        </div>

        {history.length > 1 && (
          <section>
            <h2 className="mb-2 text-[13px] font-semibold text-gray-700">
              This session
            </h2>
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
              {history.slice(1).map((h) => (
                <li
                  key={h.at}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13px]"
                >
                  <span className="truncate text-gray-800">
                    {h.kind === 'error' ? h.message : h.data.attendeeFullName}
                  </span>
                  <span
                    className={cn(
                      'whitespace-nowrap text-[12px] font-medium',
                      h.kind === 'ok' && 'text-[#1B873B]',
                      h.kind === 'duplicate' && 'text-[#92400E]',
                      h.kind === 'error' && 'text-[#C5221F]'
                    )}
                  >
                    {h.kind === 'ok'
                      ? undoneIds.has(h.data.orderId)
                        ? 'Undone'
                        : 'In'
                      : h.kind === 'duplicate'
                        ? 'Duplicate'
                        : 'Rejected'}{' '}
                    · {formatEventTime(new Date(h.at))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AdminWrapper>
  );
}
