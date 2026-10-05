'use client';

import { cn } from '@/app/_module/lib/utils';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import TicketBreakdown from '@/app/_module/components/charts/TicketBreakdown';
import RegistrationTrendChart from '@/app/_module/components/charts/RegistrationTrendChart';
import RecentAttendeesTable from '@/app/_module/components/tables/RecentAttendeesTable';
import { useDashboardOverview } from '@/app/_module/services';
import type { DashboardStatsDto } from '@/app/_module/api/types';

interface MetricCardConfig {
  label: string;
  value: string;
  background: string;
  accent: string;
}

function formatAmount(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

// `daysToEvent` is loosely typed on the API (`Record<string, never> | null`)
// even though it's really a number-or-null field at runtime — guard against
// anything else that isn't a finite number before displaying it.
function formatDaysToEvent(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : '—';
}

function buildMetricCards(stats: DashboardStatsDto): MetricCardConfig[] {
  return [
    {
      label: 'Total Attendees',
      value: stats.totalAttendees.toLocaleString('en-NG'),
      background: '#57CAFF',
      accent: '#4285F4',
    },
    {
      label: 'Tickets Sold',
      value: stats.ticketsSold.toLocaleString('en-NG'),
      background: '#57D96B',
      accent: '#34A853',
    },
    {
      label: 'Revenue',
      value: formatAmount(stats.revenue),
      background: '#FFE7A5',
      accent: '#F9AB00',
    },
    {
      label: 'Days to Event',
      value: formatDaysToEvent(stats.daysToEvent),
      background: '#F765A3',
      accent: '#EA4335',
    },
  ];
}

function MetricCard({ label, value, background, accent }: MetricCardConfig) {
  return (
    <article
      className="relative min-h-[112px] overflow-hidden rounded-[12px] px-5 py-5"
      style={{ backgroundColor: background }}
    >
      <span
        className="absolute inset-y-0 left-0 w-[8px]"
        style={{ backgroundColor: accent }}
      />
      <p className="text-[14px] font-normal leading-6 text-[#0d0d0d]">
        {label}
      </p>
      <p className="mt-4 text-[26px] font-bold leading-none text-[#171717] lg:text-[26px]">
        {value}
      </p>
    </article>
  );
}

function MetricCardSkeleton() {
  return (
    <article className="relative min-h-[112px] overflow-hidden rounded-[12px] bg-gray-100 px-5 py-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-gray-200" />
      <div className="mt-4 h-6 w-16 rounded bg-gray-200" />
    </article>
  );
}

function DashboardCardShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn('rounded-[14px] bg-white shadow-[0_4px_18px_#00000004]', className)}>
      {children}
    </section>
  );
}

export default function HomePageClient() {
  const { data, isLoading, isError } = useDashboardOverview();

  return (
    <AdminWrapper title="Home">
      <div className="px-[20px] py-[24px] md:px-8 lg:px-10 xl:px-[32px]">
        <div className="mx-auto max-w-[1450px] flex flex-col gap-[24px]">
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading || !data ? (
              Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
            ) : (
              buildMetricCards(data.stats).map((card) => (
                <MetricCard key={card.label} {...card} />
              ))
            )}
          </section>

          {isError ? (
            <p className="text-center text-[13px] text-red-400 py-8">
              Failed to load dashboard data. Please refresh.
            </p>
          ) : (
            <>
              <section className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(360px,1fr)]">
                <DashboardCardShell className="px-6 lg:p-[24px]">
                  <h2 className="text-[16px] font-bold leading-7 text-[#252525]">
                    Registration Trend
                  </h2>
                  {isLoading || !data ? (
                    <div className="mt-4 h-[230px] w-full animate-pulse rounded-lg bg-gray-100" />
                  ) : (
                    <RegistrationTrendChart data={data.registrationTrend} />
                  )}
                </DashboardCardShell>

                <DashboardCardShell className="px-6 lg:p-[24px]">
                  <h2 className="mb-[20px] text-[16px] font-bold leading-7 text-[#252525]">
                    Ticket Breakdown
                  </h2>
                  {isLoading || !data ? (
                    <div className="mt-4 h-[150px] w-full animate-pulse rounded-lg bg-gray-100" />
                  ) : (
                    <TicketBreakdown data={data.ticketBreakdown} />
                  )}
                </DashboardCardShell>
              </section>

              {isLoading || !data ? (
                <div className="mt-8 h-[320px] w-full animate-pulse rounded-[14px] bg-gray-100" />
              ) : (
                <RecentAttendeesTable attendees={data.recentAttendees} />
              )}
            </>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
