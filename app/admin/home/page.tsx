import { ReactNode } from 'react';
import { cn } from '@/app/_module/lib/utils';

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

const ticketBreakdown = [
  { label: 'Early Bird', value: '45%', color: '#4285F4' },
  { label: 'Regular', value: '35%', color: '#34A853' },
  { label: 'VIP', value: '15%', color: '#F9AB00' },
  { label: 'Student', value: '5%', color: '#EA4335' },
];

const recentAttendees = [
  {
    ticketId: '#DF82481',
    date: 'July 25, 2025',
    fullName: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦8000',
    status: 'Successful',
  },
  {
    ticketId: '#DF82481',
    date: 'July 25, 2025',
    fullName: 'Mary Esivue',
    email: 'maryesivue@gmail.com',
    amount: '₦4000',
    status: 'Successful',
  },
  {
    ticketId: '#DF82481',
    date: 'July 25, 2025',
    fullName: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4000',
    status: 'Failed',
  },
  {
    ticketId: '#DF82481',
    date: 'July 25, 2025',
    fullName: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4000',
    status: 'Pending',
  },
  {
    ticketId: '#DF82481',
    date: 'July 25, 2025',
    fullName: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4000',
    status: 'Successful',
  },
  {
    ticketId: '#DF82481',
    date: 'July 25, 2025',
    fullName: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4000',
    status: 'Successful',
  },
] as const;

type AttendeeStatus = (typeof recentAttendees)[number]['status'];

const statusStyles: Record<AttendeeStatus, string> = {
  Successful: 'bg-[#E5F6F0] text-[#087A55] before:bg-[#087A55]',
  Failed: 'bg-[#FDEBEB] text-[#EA4335] before:bg-[#EA4335]',
  Pending: 'bg-[#FFF4DD] text-[#D58A00] before:bg-[#D58A00]',
};

interface CardProps {
  children: ReactNode;
  className?: string;
}

function DashboardCard({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-[14px] bg-white shadow-[0_4px_18px_#00000004]',
        className
      )}
    >
      {children}
    </section>
  );
}

function MetricCard({
  label,
  value,
  background,
  accent,
}: (typeof metricCards)[number]) {
  return (
    <article
      className="relative min-h-[112px] overflow-hidden rounded-[10px] px-6 py-6"
      style={{ backgroundColor: background }}
    >
      <span
        className="absolute inset-y-0 left-0 w-[8px]"
        style={{ backgroundColor: accent }}
      />
      <p className="text-[16px] font-normal leading-6 text-[#0d0d0d]">
        {label}
      </p>
      <p className="mt-4 text-[28px] font-bold leading-none text-[#171717] lg:text-[30px]">
        {value}
      </p>
    </article>
  );
}

function RegistrationTrendChart() {
  const months = [
    { label: 'Jul', x: 22 },
    { label: 'Aug', x: 164 },
    { label: 'Sep', x: 306 },
    { label: 'Oct', x: 448 },
    { label: 'Nov', x: 590 },
    { label: 'Dec', x: 732 },
  ];

  return (
    <div className="mt-4">
      <svg
        viewBox="0 0 754 236"
        className="h-[230px] w-full overflow-visible"
        role="img"
        aria-label="Registration trend from July to December"
      >
        <defs>
          <filter
            id="trend-marker-shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="5"
              floodColor="#000000"
              floodOpacity="0.28"
            />
          </filter>
        </defs>

        {[20, 68, 116, 164, 212].map((y) => (
          <line
            key={y}
            x1="0"
            x2="754"
            y1={y}
            y2={y}
            stroke="#DEDEDE"
            strokeWidth="1"
          />
        ))}

        <polyline
          points="22,198 164,184 306,166 448,140 590,124 732,72"
          fill="none"
          stroke="#4285F4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        {[
          [22, 198],
          [164, 184],
          [306, 166],
          [448, 140],
          [590, 124],
          [732, 72],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="6"
            fill="#4285F4"
            stroke="#ffffff"
            strokeWidth="3"
          />
        ))}

        <g filter="url(#trend-marker-shadow)">
          <rect x="354" y="38" width="62" height="62" rx="6" fill="#0F5A91" />
          <circle cx="385" cy="67" r="31" fill="#4285F4" />
          <circle cx="385" cy="67" r="24" fill="#A142F4" />
          <text
            x="385"
            y="77"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="27"
            fontWeight="500"
          >
            M
          </text>
        </g>

        {months.map((month, index) => (
          <text
            key={month.label}
            x={10 + index * 153}
            y="258"
            fill="#757575"
            fontSize="15"
            fontWeight="400"
          >
            {month.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function TicketBreakdown() {
  return (
    <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center lg:gap-10">
      <div
        className="relative h-[164px] w-[164px] shrink-0 rounded-full"
        style={{
          background:
            'conic-gradient(from -90deg, #4285F4 0deg 162deg, #34A853 162deg 288deg, #F9AB00 288deg 342deg, #EA4335 342deg 360deg)',
        }}
      >
        <div className="absolute inset-[28px] rounded-full bg-white" />
      </div>

      <ul className="space-y-4 pt-4">
        {ticketBreakdown.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-[15px]">
            <span
              className="h-[14px] w-[14px] shrink-0 rounded-[3px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#303030]">
              {item.label} <strong>({item.value})</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ status }: { status: AttendeeStatus }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-[112px] items-center justify-center gap-2 rounded-full text-[13px] font-medium before:h-[9px] before:w-[9px] before:rounded-[2px] before:content-[""]',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}

function RecentAttendeesTable() {
  return (
    <DashboardCard className="mt-8 px-6 py-7 lg:px-8">
      <h2 className="text-[20px] font-bold leading-7 text-[#252525]">
        Recent Attendees
      </h2>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="bg-[#f7f7f7] text-left">
              {[
                'Ticket ID',
                'Date',
                'Full Name',
                'Email Address',
                'Amount',
                'Status',
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-5 text-[14px] font-semibold text-[#111111]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentAttendees.map((attendee, index) => (
              <tr
                key={`${attendee.ticketId}-${index}`}
                className="border-b border-[#eeeeee]"
              >
                <td className="px-4 py-5 text-[14px] text-[#111111]">
                  {attendee.ticketId}
                </td>
                <td className="px-4 py-5 text-[14px] text-[#111111]">
                  {attendee.date}
                </td>
                <td className="px-4 py-5 text-[14px] text-[#111111]">
                  {attendee.fullName}
                </td>
                <td className="px-4 py-5 text-[14px] text-[#111111]">
                  {attendee.email}
                </td>
                <td className="px-4 py-5 text-[14px] text-[#111111]">
                  {attendee.amount}
                </td>
                <td className="px-4 py-5 text-[14px]">
                  <StatusBadge status={attendee.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

export default function AdminHome() {
  return (
    <div className="min-h-screen px-5 py-8 md:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-[1450px]">
        <header className="border-b border-[#dedede] pb-4">
          <h1 className="text-[34px] font-bold leading-tight text-[#1e1e1e]">
            Home
          </h1>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(360px,1fr)]">
          <DashboardCard className="px-6 py-7 lg:px-8">
            <h2 className="text-[20px] font-bold leading-7 text-[#252525]">
              Registration Trend
            </h2>
            <RegistrationTrendChart />
          </DashboardCard>

          <DashboardCard className="px-6 py-7 lg:px-8">
            <h2 className="text-[20px] font-bold leading-7 text-[#252525]">
              Ticket Breakdown
            </h2>
            <TicketBreakdown />
          </DashboardCard>
        </section>

        <RecentAttendeesTable />
      </div>
    </div>
  );
}
