import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '../../lib/utils';
import DashboardCard from '../cards/DashboardCard';
import type { RecentAttendeeDto } from '@/app/_module/api/types';

type AttendeeStatus = RecentAttendeeDto['status'];

const STATUS_LABELS: Record<AttendeeStatus, string> = {
  PAID: 'Paid',
  AWAITING_PAYMENT: 'Awaiting Payment',
  CANCELLED: 'Cancelled',
  AWAITING_REFUND: 'Awaiting Refund',
  REFUNDED: 'Refunded',
};

// Matches the status badge palette used across Orders/Attendees tables.
const STATUS_CONFIG: Record<AttendeeStatus, { bg: string; text: string; dot: string }> = {
  PAID: { bg: 'bg-[#E8F5E9]', text: 'text-[#1B873B]', dot: 'bg-[#34A853]' },
  AWAITING_PAYMENT: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', dot: 'bg-[#F59E0B]' },
  CANCELLED: { bg: 'bg-[#FDECEA]', text: 'text-[#C5221F]', dot: 'bg-[#EA4335]' },
  AWAITING_REFUND: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', dot: 'bg-[#F59E0B]' },
  REFUNDED: { bg: 'bg-[#F1F3F4]', text: 'text-[#5F6368]', dot: 'bg-[#9AA0A6]' },
};

function StatusBadge({ status }: { status: AttendeeStatus }) {
  const styles = STATUS_CONFIG[status] ?? STATUS_CONFIG.AWAITING_PAYMENT;
  return (
    <span
      className={cn(
        'flex items-center gap-[5px] px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium',
        styles.bg,
        styles.text
      )}
    >
      <span className={cn('w-[7px] h-[7px] rounded-[2px]', styles.dot)} />
      <span>{STATUS_LABELS[status] ?? status}</span>
    </span>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'MMMM d, yyyy') : iso;
}

function formatAmount(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

interface RecentAttendeesTableProps {
  attendees: RecentAttendeeDto[];
}

const RecentAttendeesTable = ({ attendees }: RecentAttendeesTableProps) => {
  return (
    <DashboardCard className="mt-8 p-8 lg:p-[20px]">
      <h2 className="text-[16px] font-bold leading-7 text-[#252525]">
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
            {attendees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-gray-400">
                  No recent attendees yet.
                </td>
              </tr>
            ) : (
              attendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-[#eeeeee]">
                  <td className="px-4 py-5 text-[12px] text-[#111111]">
                    {attendee.reference}
                  </td>
                  <td className="px-4 py-5 text-[12px] text-[#111111]">
                    {formatDate(attendee.date)}
                  </td>
                  <td className="px-4 py-5 text-[12px] text-[#111111]">
                    {attendee.fullName}
                  </td>
                  <td className="px-4 py-5 text-[12px] text-[#111111]">
                    {attendee.email}
                  </td>
                  <td className="px-4 py-5 text-[12px] text-[#111111]">
                    {formatAmount(attendee.amount)}
                  </td>
                  <td className="text-[12px]">
                    <StatusBadge status={attendee.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default RecentAttendeesTable;
