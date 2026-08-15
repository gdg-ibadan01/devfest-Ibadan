'use client';

import { useState } from 'react';
import { Search, Download, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { AttendeeRecord, AttendeeStatus } from '../_types/attendee.types';
import AttendeeActionsMenu from './AttendeeActionsMenu';

/* ------------------------------------------------------------------ */
/* Mock data                                                            */
/* ------------------------------------------------------------------ */
const MOCK_ATTENDEES: AttendeeRecord[] = [
  { id: '1', ticketId: 'TKT-001', date: '12th Aug, 2025', fullName: 'Adesola Okonkwo', email: 'adesola@example.com', code: 'DEV-A1B2', eventDays: 'Friday & Saturday', amount: '₦8,000', status: 'Successful' },
  { id: '2', ticketId: 'TKT-002', date: '12th Aug, 2025', fullName: 'Chukwuemeka Nwosu', email: 'emeka@example.com', code: 'DEV-C3D4', eventDays: 'Saturday', amount: '₦8,000', status: 'Pending' },
  { id: '3', ticketId: 'TKT-003', date: '13th Aug, 2025', fullName: 'Fatima Bello', email: 'fatima@example.com', code: 'DEV-E5F6', eventDays: 'Friday', amount: '₦4,000', status: 'Successful' },
  { id: '4', ticketId: 'TKT-004', date: '13th Aug, 2025', fullName: 'Olumide Adeyemi', email: 'olumide@example.com', code: 'DEV-G7H8', eventDays: 'Friday & Saturday', amount: '₦8,000', status: 'Failed' },
  { id: '5', ticketId: 'TKT-005', date: '14th Aug, 2025', fullName: 'Ngozi Eze', email: 'ngozi@example.com', code: 'DEV-I9J0', eventDays: 'Saturday', amount: '₦8,000', status: 'Successful' },
  { id: '6', ticketId: 'TKT-006', date: '14th Aug, 2025', fullName: 'Seun Abiodun', email: 'seun@example.com', code: 'DEV-K1L2', eventDays: 'Friday & Saturday', amount: '₦8,000', status: 'Pending' },
];

/* ------------------------------------------------------------------ */
/* Status badge                                                         */
/* ------------------------------------------------------------------ */
const STATUS_CONFIG: Record<AttendeeStatus, { dot: string; text: string; bg: string }> = {
  Successful: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]' },
  Failed:     { dot: 'bg-[#EA4335]', text: 'text-[#C5221F]', bg: 'bg-[#FDECEA]' },
  Pending:    { dot: 'bg-[#F59E0B]', text: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
};

function StatusBadge({ status }: { status: AttendeeStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-[5px] px-3 py-[4px] rounded-full text-[11px] font-medium', cfg.bg, cfg.text)}>
      <span className={cn('w-[6px] h-[6px] rounded-full flex-shrink-0', cfg.dot)} />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Custom checkbox (matches Roles table style)                          */
/* ------------------------------------------------------------------ */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
        checked ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white hover:border-gray-500'
      )}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                          */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <tr>
      <td colSpan={10} className="py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-[120px] h-[120px] flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect x="10" y="18" width="40" height="36" rx="3" fill="#E5E7EB" />
              <rect x="14" y="14" width="40" height="36" rx="3" fill="#F3F4F6" />
              <rect x="18" y="10" width="40" height="36" rx="3" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="26" y1="22" x2="50" y2="22" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="28" x2="50" y2="28" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="34" x2="40" y2="34" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="50" cy="46" r="12" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5" />
              <circle cx="50" cy="46" r="7" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="55" y1="53" x2="61" y2="59" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="46" r="7" fill="none" stroke="#9CA3AF" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-gray-700">No Data</p>
            <p className="text-[12px] text-gray-400 mt-1">
              There is no data to
              <br />
              show you right now
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
interface AttendeesTableProps {
  onAddNew: () => void;
  onCheckIn: (attendee: AttendeeRecord) => void;
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */
const COLUMNS = ['', 'Ticket ID', 'Date', 'Full Name', 'Email Address', 'Code', 'Event Day(s)', 'Amount', 'Status', 'Action'];

export default function AttendeesTable({ onAddNew, onCheckIn }: AttendeesTableProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_ATTENDEES.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.ticketId.toLowerCase().includes(search.toLowerCase())
  );

  const allChecked = filtered.length > 0 && filtered.every((a) => selected.has(a.id));

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
      {/* Toolbar — outside the table card, matches Roles pattern */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center flex-1 max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
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

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Add New Attendee
            <Plus size={16} strokeWidth={2.5} />
          </button>

          <button className="w-[42px] h-[42px] flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600">
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
                {/* Checkbox header */}
                <th className="px-5 py-4 text-left w-10">
                  <Checkbox checked={allChecked} onChange={toggleAll} />
                </th>
                {COLUMNS.slice(1).map((col) => (
                  <th key={col} className="px-5 py-4 text-left text-[12px] font-medium text-gray-500 whitespace-nowrap">
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
                    {/* Checkbox — stop propagation */}
                    <td className="px-5 py-4 w-10" onClick={(e) => e.stopPropagation()}>
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

                    {/* Action — stop propagation */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <AttendeeActionsMenu onCheckIn={() => onCheckIn(attendee)} />
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
