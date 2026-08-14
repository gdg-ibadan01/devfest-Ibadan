import React from 'react';
import { cn } from '../../lib/utils';
import DashboardCard from '../cards/DashboardCard';


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

function StatusBadge({ status }: { status: AttendeeStatus }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-auto items-center justify-center gap-2 rounded-full text-[13px] font-medium before:h-[9px] before:w-[9px] before:rounded-[2px]',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}

const RecentAttendeesTable = () => {
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
            {recentAttendees.map((attendee, index) => (
              <tr
                key={`${attendee.ticketId}-${index}`}
                className="border-b border-[#eeeeee]"
              >
                <td className="px-4 py-5 text-[12px] text-[#111111]">
                  {attendee.ticketId}
                </td>
                <td className="px-4 py-5 text-[12px] text-[#111111]">
                  {attendee.date}
                </td>
                <td className="px-4 py-5 text-[12px] text-[#111111]">
                  {attendee.fullName}
                </td>
                <td className="px-4 py-5 text-[12px] text-[#111111]">
                  {attendee.email}
                </td>
                <td className="px-4 py-5 text-[12px] text-[#111111]">
                  {attendee.amount}
                </td>
                <td className="text-[12px]">
                  <StatusBadge status={attendee.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default RecentAttendeesTable;
