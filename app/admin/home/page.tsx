import { ReactNode } from 'react';
import { cn } from '@/app/_module/lib/utils';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import TicketBreakdown from '@/app/_module/components/charts/TicketBreakdown';
import RegistrationTrendChart from '@/app/_module/components/charts/RegistrationTrendChart';
import RecentAttendeesTable from '../_components/RecentAttendeesTable';
import DashboardCard from '@/app/_module/components/cards/DashboardCard';


const metricCards = [
  {
    label: 'Total Attendees',
    value: '1,247',
    background: '#57CAFF',
    accent: '#4285F4',
  },
  {
    label: 'Tickets Sold',
    value: '892',
    background: '#57D96B',
    accent: '#34A853',
  },
  {
    label: 'Revenue',
    value: '₦4,250,000',
    background: '#FFE7A5',
    accent: '#F9AB00',
  },
  {
    label: 'Days to Event',
    value: '15',
    background: '#F765A3',
    accent: '#EA4335',
  },
];


function MetricCard({
  label,
  value,
  background,
  accent,
}: (typeof metricCards)[number]) {
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


export default function AdminHome() {
  return (
    <AdminWrapper title="Home">
      <div className="px-5 py-[24px] md:px-8 lg:px-10 xl:px-[32px]">
        <div className="mx-auto max-w-[1450px] flex flex-col gap-[24px]">
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((card) => (
              <MetricCard key={card.label} {...card} />
            ))}
          </section>

          <section className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(360px,1fr)]">
            <DashboardCard className="px-6 lg:p-[24px]">
              <h2 className="text-[16px] font-bold leading-7 text-[#252525]">
                Registration Trend
              </h2>
              <RegistrationTrendChart />
            </DashboardCard>

            <DashboardCard className="px-6 lg:p-[24px]">
              <h2 className="mb-[20px] text-[16px] font-bold leading-7 text-[#252525]">
                Ticket Breakdown
              </h2>
              <TicketBreakdown />
            </DashboardCard>
          </section>

          <RecentAttendeesTable />
        </div>
      </div>
    </AdminWrapper>
  );
}
