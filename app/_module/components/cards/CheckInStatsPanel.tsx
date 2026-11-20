'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/app/_module/lib/utils';
import { useCheckInStats } from '@/app/_module/services/attendees.service';
import { eventToday, formatEventTime } from '@/app/_module/lib/eventDate';
import type { CheckInStatsResponseDto } from '@/app/_module/api/types';

interface CheckInStatsPanelProps {
  /** Scope the numbers to one ticket (Checkins tab follows its ticket filter). */
  ticketId?: string;
  /** Hide the per-hour chart (Home keeps it compact). */
  compact?: boolean;
  className?: string;
}

const CARD_STYLES = [
  { background: '#57D96B', accent: '#34A853' },
  { background: '#57CAFF', accent: '#4285F4' },
  { background: '#FFE7A5', accent: '#F9AB00' },
  { background: '#F765A3', accent: '#EA4335' },
];

function formatDayLabel(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return d.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function hourLabel(hour: number) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${hour < 12 ? 'am' : 'pm'}`;
}

function StatCard({
  label,
  value,
  hint,
  background,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  background: string;
  accent: string;
}) {
  return (
    <article
      className="relative min-h-[104px] overflow-hidden rounded-[12px] px-5 py-4"
      style={{ backgroundColor: background }}
    >
      <span
        className="absolute inset-y-0 left-0 w-[8px]"
        style={{ backgroundColor: accent }}
      />
      <p className="text-[14px] leading-6 text-[#0d0d0d]">{label}</p>
      <p className="mt-3 text-[26px] font-bold leading-none text-[#171717] tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-2 text-[12px] text-[#171717]/70">{hint}</p>}
    </article>
  );
}

function buildCards(stats: CheckInStatsResponseDto) {
  const n = (v: number) => v.toLocaleString('en-NG');
  return [
    {
      label: 'Checked In',
      value: n(stats.checkedIn),
      hint: stats.lastCheckInAt
        ? `Last at ${formatEventTime(stats.lastCheckInAt)}`
        : 'No check-ins yet',
    },
    {
      label: 'Expected',
      value: n(stats.expected),
      hint: 'Paid tickets valid this day',
    },
    { label: 'Yet to Arrive', value: n(stats.remaining) },
    {
      label: 'Check-in Rate',
      value: `${stats.checkInRate}%`,
      hint: `${n(stats.totalCheckedInAllDays)} checked in across all days`,
    },
  ];
}

export default function CheckInStatsPanel({
  ticketId,
  compact = false,
  className,
}: CheckInStatsPanelProps) {
  const [date, setDate] = useState(eventToday);
  const isToday = date === eventToday();
  const { data, isLoading, isError, isFetching } = useCheckInStats({
    date,
    ticketId: ticketId || undefined,
  });

  return (
    <section
      className={cn(
        'rounded-[14px] bg-white p-5 shadow-[0_4px_18px_#00000004] lg:p-6',
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold leading-7 text-[#252525]">
            Check-ins · {formatDayLabel(date)}
          </h2>
          {isToday && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-2 py-[2px] text-[11px] font-medium text-[#1B873B]">
              <span
                className={cn(
                  'h-[6px] w-[6px] rounded-full bg-[#34A853]',
                  isFetching && 'animate-pulse'
                )}
              />
              Live
            </span>
          )}
        </div>
        <label className="flex items-center gap-2 text-[12px] text-gray-500">
          Day
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="rounded-md border border-gray-200 px-2 py-1 text-[12px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </label>
      </div>

      {isError ? (
        <p className="py-6 text-center text-[13px] text-red-400">
          Couldn&apos;t load check-in stats. They&apos;ll retry automatically.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading || !data
              ? CARD_STYLES.map((_, i) => (
                  <div
                    key={i}
                    className="min-h-[104px] animate-pulse rounded-[12px] bg-gray-100"
                  />
                ))
              : buildCards(data).map((card, i) => (
                  <StatCard key={card.label} {...card} {...CARD_STYLES[i]} />
                ))}
          </div>

          {data && data.expected === 0 && (
            <p className="mt-4 text-[13px] text-gray-500">
              No paid tickets are valid on {formatDayLabel(date)}
              {ticketId ? ' for this ticket' : ''}. Pick an event day above.
            </p>
          )}

          {data && data.byTicket.length > 0 && (
            <div
              className={cn(
                'mt-6 grid gap-6',
                !compact && 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]'
              )}
            >
              <div>
                <h3 className="mb-3 text-[13px] font-semibold text-gray-700">
                  By ticket
                </h3>
                <ul className="flex flex-col gap-3">
                  {data.byTicket.map((t) => (
                    <li key={t.ticketId}>
                      <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="truncate text-gray-800">
                          {t.ticketName}
                        </span>
                        <span className="whitespace-nowrap tabular-nums text-gray-500">
                          {t.checkedIn.toLocaleString('en-NG')} /{' '}
                          {t.expected.toLocaleString('en-NG')} · {t.checkInRate}
                          %
                        </span>
                      </div>
                      <div className="h-[8px] w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#34A853] transition-[width] duration-500"
                          style={{ width: `${Math.min(100, t.checkInRate)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {!compact && (
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold text-gray-700">
                    Arrivals by hour
                  </h3>
                  {data.byHour.length === 0 ? (
                    <div className="flex h-[180px] items-center justify-center rounded-lg bg-gray-50 text-[13px] text-gray-400">
                      No arrivals yet
                    </div>
                  ) : (
                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.byHour.map((h) => ({
                            label: hourLabel(h.hour),
                            count: h.count,
                          }))}
                          margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid stroke="#EEEEEE" vertical={false} />
                          <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#5F6368' }}
                          />
                          <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#5F6368' }}
                          />
                          <Tooltip
                            cursor={{ fill: '#F1F3F4' }}
                            formatter={(v) => [v, 'Check-ins']}
                          />
                          <Bar
                            dataKey="count"
                            fill="#4285F4"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {!compact && data && data.byStaff.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-[13px] font-semibold text-gray-700">
                Check-ins by staff
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[12px] text-gray-600">
                      <th className="px-4 py-2 font-semibold">Staff</th>
                      <th className="px-4 py-2 font-semibold text-right">
                        Checked in
                      </th>
                      <th className="px-4 py-2 font-semibold text-right">
                        Duplicate scans
                      </th>
                      <th className="px-4 py-2 font-semibold text-right">
                        Undone
                      </th>
                      <th className="px-4 py-2 font-semibold text-right">
                        Last active
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byStaff.map((s) => (
                      <tr key={s.adminId} className="border-t border-gray-100">
                        <td className="px-4 py-2 text-gray-800">
                          {s.fullName}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold tabular-nums">
                          {s.checkIns.toLocaleString('en-NG')}
                        </td>
                        <td
                          className={cn(
                            'px-4 py-2 text-right tabular-nums',
                            s.duplicateScans > 0
                              ? 'text-[#92400E]'
                              : 'text-gray-500'
                          )}
                        >
                          {s.duplicateScans}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-gray-500">
                          {s.undos}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-500">
                          {s.lastActivityAt
                            ? formatEventTime(s.lastActivityAt)
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
