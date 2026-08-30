'use client';

import { useState, useCallback, useRef } from 'react';
import { Search, Download, ChevronDown, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import type { AttendeeDto } from '@/app/_module/api/types';
import { useAttendees } from '@/app/_module/services';
import { DatePickerInput } from '@/app/_module/components/ui/DatePicker';
import AttendeeActionsMenu from './AttendeeActionsMenu';
import EmptyState from '@/app/_module/components/common/EmptyState';

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = AttendeeDto['status'];

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUSES: Status[] = ['Successful', 'Failed', 'Pending'];

const STATUS_CONFIG: Record<Status, { dot: string; text: string; bg: string }> = {
  Successful: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]' },
  Failed:     { dot: 'bg-[#EA4335]', text: 'text-[#C5221F]', bg: 'bg-[#FDECEA]' },
  Pending:    { dot: 'bg-[#F59E0B]', text: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
};

const COLUMNS = ['', 'Ticket ID', 'Date', 'Full Name', 'Email Address', 'Code', 'Event Day(s)', 'Amount', 'Status', 'Action'];

const PAGE_SIZE = 15;

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium', cfg.bg, cfg.text)}>
      <span className={cn('w-[7px] h-[7px] rounded-full flex-shrink-0', cfg.dot)} />
      {status}
    </span>
  );
}

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

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {COLUMNS.map((c) => (
        <td key={c} className="px-5 py-4">
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function StatusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-5 py-[11px] border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        {value || 'Status'} <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[130px]">
            <button
              onClick={() => { onChange(''); setOpen(false); }}
              className={cn('w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50', !value && 'font-semibold')}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className={cn('w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50', value === s && 'font-semibold')}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Export helpers ────────────────────────────────────────────────────────────

function formatDateSafe(iso?: string): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'dd MMM yyyy') : iso;
}

function exportCSV(rows: AttendeeDto[]) {
  const headers = ['Ticket ID', 'Date', 'Full Name', 'Email', 'Code', 'Event Day(s)', 'Amount', 'Status'];
  const lines = rows.map((a) => [
    a.ticketId ?? '',
    formatDateSafe(a.createdAt),
    a.fullName,
    a.email,
    a.code ?? '',
    a.eventDays ?? '',
    a.amount ?? '',
    a.status,
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendees-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(rows: AttendeeDto[]) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape' });
  doc.text('Attendees List', 14, 14);

  autoTable(doc, {
    startY: 22,
    head: [['Ticket ID', 'Date', 'Full Name', 'Email', 'Code', 'Event Day(s)', 'Amount', 'Status']],
    body: rows.map((a) => [
      a.ticketId ?? '',
      formatDateSafe(a.createdAt),
      a.fullName,
      a.email,
      a.code ?? '',
      a.eventDays ?? '',
      a.amount ?? '',
      a.status,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [20, 20, 20] },
  });

  doc.save(`attendees-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

// ── Main Table ────────────────────────────────────────────────────────────────

interface AttendeesTableProps {
  onAddNew: () => void;
  onCheckIn: (attendee: AttendeeDto) => void;
}

export default function AttendeesTable({ onAddNew, onCheckIn }: AttendeesTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exportOpen, setExportOpen] = useState(false);

  const { data, isLoading, isError } = useAttendees({
    page,
    limit: PAGE_SIZE,
    search: searchQuery || undefined,
    date: filterDate || undefined,
    status: filterStatus || undefined,
  });

  const attendees = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const hasFilters = !!(searchQuery || filterDate || filterStatus);

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setFilterDate('');
    setFilterStatus('');
    setPage(1);
  };

  const allChecked = attendees.length > 0 && attendees.every((a) => selected.has(a.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(attendees.map((a) => a.id)));
  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleExportCSV = () => { exportCSV(attendees); setExportOpen(false); };
  const handleExportPDF = () => { exportPDF(attendees); setExportOpen(false); };

  return (
    <>
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        {/* Search input */}
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[400px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for attendee"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="mr-3 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors"
        >
          Search
        </button>

        {/* Date filter */}
        <div className="w-full sm:w-[180px]">
          <DatePickerInput
            value={filterDate}
            onChange={(v) => { setFilterDate(v); setPage(1); }}
            placeholder="Filter by date"
          />
        </div>

        {/* Status filter */}
        <StatusDropdown value={filterStatus} onChange={(v) => { setFilterStatus(v); setPage(1); }} />

        {hasFilters && (
          <button onClick={clearFilters} className="text-[12px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 whitespace-nowrap">
            <X size={12} /> Clear filters
          </button>
        )}

        <div className="sm:ml-auto flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onAddNew}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Add New Attendee <Plus size={16} strokeWidth={2.5} />
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportOpen((p) => !p)}
              className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
              title="Export"
            >
              <Download size={15} />
            </button>
            {exportOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[130px]">
                  <button onClick={handleExportCSV} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 font-medium">
                    Export as CSV
                  </button>
                  <button onClick={handleExportPDF} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 font-medium">
                    Export as PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-4 text-left w-10">
                  <Checkbox checked={allChecked} onChange={toggleAll} />
                </th>
                {COLUMNS.slice(1).map((col) => (
                  <th key={col} className="px-5 py-4 text-left text-[12px] font-semibold text-gray-700 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-12 text-[13px] text-red-400">
                    Failed to load attendees. Please refresh.
                  </td>
                </tr>
              ) : attendees.length === 0 ? (
                <EmptyState />
              ) : (
                attendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selected.has(attendee.id)} onChange={() => toggleOne(attendee.id)} />
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                      {attendee.ticketId ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {formatDateSafe(attendee.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                      {attendee.fullName}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {attendee.email}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-mono text-gray-700 whitespace-nowrap">
                      {attendee.code ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {attendee.eventDays ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-gray-800 whitespace-nowrap">
                      {attendee.amount ? `₦${parseFloat(attendee.amount).toLocaleString('en-NG')}` : '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={attendee.status} />
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <AttendeeActionsMenu onCheckIn={() => onCheckIn(attendee)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
            <span className="text-[12px] text-gray-400">
              Page {page} of {totalPages} · {meta?.total ?? 0} attendees
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  page <= 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  page >= totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
