'use client';

import { useState } from 'react';
import { Search, Download, ChevronDown } from 'lucide-react';
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
/* Status badge config                                                   */
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
/* Empty state                                                          */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="28" width="56" height="72" rx="6" fill="#F3F4F6" />
        <rect x="26" y="40" width="40" height="6" rx="3" fill="#D1D5DB" />
        <rect x="26" y="52" width="32" height="6" rx="3" fill="#D1D5DB" />
        <rect x="26" y="64" width="36" height="6" rx="3" fill="#D1D5DB" />
        <rect x="26" y="76" width="28" height="6" rx="3" fill="#E5E7EB" />
        <rect x="28" y="18" width="56" height="72" rx="6" fill="#E5E7EB" />
        <rect x="36" y="30" width="40" height="6" rx="3" fill="#D1D5DB" />
        <rect x="36" y="42" width="32" height="6" rx="3" fill="#D1D5DB" />
        <rect x="38" y="8" width="56" height="72" rx="6" fill="#D1D5DB" />
        <rect x="46" y="20" width="32" height="6" rx="3" fill="#9CA3AF" />
        <rect x="46" y="32" width="24" height="6" rx="3" fill="#9CA3AF" />
        <circle cx="85" cy="72" r="22" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
        <circle cx="85" cy="72" r="14" fill="#F3F4F6" />
        <line x1="97" y1="85" x2="108" y2="97" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        <circle cx="85" cy="72" r="14" fill="none" stroke="#9CA3AF" strokeWidth="3" />
      </svg>
      <p className="text-[15px] font-semibold text-gray-700">No Data</p>
      <p className="text-[13px] text-gray-400">There is no data to show you right now</p>
    </div>
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
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function AttendeesTable({ onAddNew, onCheckIn }: AttendeesTableProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = MOCK_ATTENDEES.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.ticketId.toLowerCase().includes(search.toLowerCase())
  );

  const allChecked = filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-[200px] flex-1 max-w-xs">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="text-[13px] text-gray-700 placeholder:text-gray-400 bg-transparent outline-none w-full"
          />
        </div>

        <button className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Search
        </button>

        {/* Date filter */}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Date <ChevronDown size={14} />
        </button>

        {/* Status filter */}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Status <ChevronDown size={14} />
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Add new */}
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-[13px] font-semibold hover:bg-black transition-colors"
          >
            Add New Attendee
            <span className="text-[16px] font-bold leading-none">+</span>
          </button>

          {/* Download */}
          <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-gray-900 cursor-pointer"
                  />
                </th>
                {['Ticket ID', 'Date', 'Full Name', 'Email Address', 'Code', 'Event Day(s)', 'Amount', 'Status', ''].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((attendee, i) => (
                <tr
                  key={attendee.id}
                  className={cn(
                    'border-b border-gray-50 hover:bg-gray-50/60 transition-colors',
                    i === filtered.length - 1 && 'border-b-0'
                  )}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(attendee.id)}
                      onChange={() => toggleOne(attendee.id)}
                      className="w-4 h-4 accent-gray-900 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">{attendee.ticketId}</td>
                  <td className="px-4 py-4 text-[13px] text-gray-600 whitespace-nowrap">{attendee.date}</td>
                  <td className="px-4 py-4 text-[13px] text-gray-800 font-medium whitespace-nowrap">{attendee.fullName}</td>
                  <td className="px-4 py-4 text-[13px] text-gray-500 whitespace-nowrap">{attendee.email}</td>
                  <td className="px-4 py-4 text-[13px] font-mono text-gray-700 whitespace-nowrap">{attendee.code}</td>
                  <td className="px-4 py-4 text-[13px] text-gray-600 whitespace-nowrap">{attendee.eventDays}</td>
                  <td className="px-4 py-4 text-[13px] font-semibold text-gray-800 whitespace-nowrap">{attendee.amount}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={attendee.status} />
                  </td>
                  <td className="px-4 py-4">
                    <AttendeeActionsMenu onCheckIn={() => onCheckIn(attendee)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
