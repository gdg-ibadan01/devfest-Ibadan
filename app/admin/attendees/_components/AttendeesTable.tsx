'use client';

import { useState } from 'react';
import { Search, Download, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { AttendeeRecord, AttendeeStatus } from '../_types/attendee.types';
import AttendeeActionsMenu from './AttendeeActionsMenu';
import MOCK_ATTENDEES from './AttendeesMockData';
import EmptyState from '@/app/_module/components/common/EmptyState';


const STATUS_CONFIG: Record<
  AttendeeStatus,
  { dot: string; text: string; bg: string }
> = {
  Successful: {
    dot: 'bg-[#34A853]',
    text: 'text-[#1B873B]',
    bg: 'bg-[#E8F5E9]',
  },
  Failed: { dot: 'bg-[#EA4335]', text: 'text-[#C5221F]', bg: 'bg-[#FDECEA]' },
  Pending: { dot: 'bg-[#F59E0B]', text: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
};

function StatusBadge({ status }: { status: AttendeeStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'flex items-center gap-[2px] px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium',
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cn('w-[8px] h-[8px] rounded-[1.3px]', cfg.dot)} />
      <span className={cn('w-[6px] h-[6px] rounded-full flex-shrink-0')} />
      {status}
    </span>
  );
}


function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
        checked
          ? 'bg-gray-900 border-gray-900'
          : 'border-gray-300 bg-white hover:border-gray-500'
      )}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M1 4L3 6L7 2"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}




interface AttendeesTableProps {
  onAddNew: () => void;
  onCheckIn: (attendee: AttendeeRecord) => void;
}


const COLUMNS = [
  '',
  'Ticket ID',
  'Date',
  'Full Name',
  'Email Address',
  'Code',
  'Event Day(s)',
  'Amount',
  'Status',
  'Action',
];

export default function AttendeesTable({
  onAddNew,
  onCheckIn,
}: AttendeesTableProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_ATTENDEES.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.ticketId.toLowerCase().includes(search.toLowerCase())
  );

  const allChecked =
    filtered.length > 0 && filtered.every((a) => selected.has(a.id));

  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for attendee"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        <button className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors">
          Search
        </button>

        {/* Date filter */}
        <button className="flex items-center gap-1.5 px-5 py-[11px] border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Date <ChevronDown size={14} />
        </button>

        {/* Status filter */}
        <button className="flex items-center gap-1.5 px-5 py-[11px] border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Status <ChevronDown size={14} />
        </button>

        <div className="sm:ml-auto flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onAddNew}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Add New Attendee
            <Plus size={16} strokeWidth={2.5} />
          </button>

          <button className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600">
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-4 text-left w-10">
                  <Checkbox checked={allChecked} onChange={toggleAll} />
                </th>
                {COLUMNS.slice(1).map((col) => (
                  <th
                    key={col}
                    className="px-5 py-4 text-left text-[13px] font-semibold text-[#121212] whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map((attendee) => (
                  <tr
                    key={attendee.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td
                      className="px-5 py-4 w-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selected.has(attendee.id)}
                        onChange={() => toggleOne(attendee.id)}
                      />
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                      {attendee.ticketId}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {attendee.date}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                      {attendee.fullName}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {attendee.email}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-mono text-gray-700 whitespace-nowrap">
                      {attendee.code}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {attendee.eventDays}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-gray-800 whitespace-nowrap">
                      {attendee.amount}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={attendee.status} />
                    </td>
                    <td
                      className="px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AttendeeActionsMenu
                        onCheckIn={() => onCheckIn(attendee)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
