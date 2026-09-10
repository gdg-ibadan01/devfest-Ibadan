'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Download,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TicketIcon,
} from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import type { CheckedInListItemDto, TicketListItemDto } from '@/app/_module/api/types';
import EmptyState from '@/app/_module/components/common/EmptyState';
import { useTickets } from '@/app/_module/services/tickets.service';
import { useCheckedInAttendees } from '@/app/_module/services/attendees.service';

// ── Constants ─────────────────────────────────────────────────────────────────

const COLUMNS = [
  'Full Name',
  'Email Address',
  'Ticket',
  'Code',
  'Validity',
  'Amount',
  'Status',
  'Checked In At',
];

const PAGE_SIZE = 15;

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Paid',
  AWAITING_PAYMENT: 'Awaiting Payment',
  CANCELLED: 'Cancelled',
  AWAITING_REFUND: 'Awaiting Refund',
  REFUNDED: 'Refunded',
};

const STATUS_CONFIG: Record<string, { dot: string; text: string; bg: string }> = {
  PAID: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]' },
  AWAITING_PAYMENT: { dot: 'bg-[#F59E0B]', text: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
  CANCELLED: { dot: 'bg-[#EA4335]', text: 'text-[#C5221F]', bg: 'bg-[#FDECEA]' },
  AWAITING_REFUND: { dot: 'bg-[#F59E0B]', text: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
  REFUNDED: { dot: 'bg-[#9AA0A6]', text: 'text-[#5F6368]', bg: 'bg-[#F1F3F4]' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.AWAITING_PAYMENT;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium whitespace-nowrap',
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cn('w-[7px] h-[7px] rounded-full flex-shrink-0', cfg.dot)} />
      {STATUS_LABELS[status] ?? status}
    </span>
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

function TicketFilterDropdown({
  tickets,
  loading,
  value,
  onChange,
}: {
  tickets: TicketListItemDto[];
  loading: boolean;
  value: string;
  onChange: (ticketId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = tickets.find((t) => t.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-5 py-[11px] border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        <TicketIcon size={14} className="text-gray-400" />
        {selected ? selected.name : 'Select ticket'} <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[220px] max-h-[280px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-[13px] text-gray-400">Loading tickets…</div>
            ) : tickets.length === 0 ? (
              <div className="px-4 py-3 text-[13px] text-gray-400">No tickets found</div>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onChange(t.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 whitespace-nowrap',
                    value === t.id && 'font-semibold'
                  )}
                >
                  {t.name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Export helpers ────────────────────────────────────────────────────────────

function formatDateSafe(iso?: string | null): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'dd MMM yyyy, h:mm a') : iso;
}

function exportRows(rows: CheckedInListItemDto[]) {
  return rows.map((a) => [
    a.attendeeFullName,
    a.attendeeEmail,
    a.ticket?.name ?? '',
    a.ticket?.code ?? '',
    a.ticket?.validity ?? '',
    a.amount,
    STATUS_LABELS[a.status] ?? a.status,
    a.checkIns.length > 0 ? formatDateSafe(a.checkIns[a.checkIns.length - 1]) : '—',
  ]);
}

function exportCSV(rows: CheckedInListItemDto[], ticketName?: string) {
  const headers = [
    'Full Name',
    'Email',
    'Ticket',
    'Code',
    'Validity',
    'Amount',
    'Status',
    'Checked In At',
  ];
  const lines = exportRows(rows).map((row) =>
    row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
  );

  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `checkins-${ticketName ? ticketName.replace(/\s+/g, '-').toLowerCase() + '-' : ''}${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(rows: CheckedInListItemDto[], ticketName?: string) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape' });
  doc.text(`Checked-In Attendees${ticketName ? ` — ${ticketName}` : ''}`, 14, 14);

  autoTable(doc, {
    startY: 22,
    head: [
      ['Full Name', 'Email', 'Ticket', 'Code', 'Validity', 'Amount', 'Status', 'Checked In At'],
    ],
    body: exportRows(rows),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [20, 20, 20] },
  });

  doc.save(
    `checkins-${ticketName ? ticketName.replace(/\s+/g, '-').toLowerCase() + '-' : ''}${format(new Date(), 'yyyy-MM-dd')}.pdf`
  );
}

// ── Main Table ────────────────────────────────────────────────────────────────

export default function CheckinsTable() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<'next' | 'previous' | undefined>(
    undefined
  );
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [exportOpen, setExportOpen] = useState(false);

  // All tickets that have been created — used to populate the ticket-select
  // dropdown, whose chosen ticket's `eventDates` are sent to the checked-in
  // attendees API (per-ticket check-ins are scoped by event date).
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets({ limit: 50 });
  const tickets = useMemo(() => ticketsData?.data ?? [], [ticketsData]);

  // Default the dropdown to the first ticket in the list once tickets load,
  // instead of leaving nothing selected.
  const firstTicketId = tickets[0]?.id;
  useEffect(() => {
    if (firstTicketId && !selectedTicketId) {
      setSelectedTicketId(firstTicketId);
    }
  }, [firstTicketId, selectedTicketId]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);
  // The API requires each event date as a plain "YYYY-MM-DD" string. The
  // ticket's `eventDates` may come back as full ISO datetimes (e.g.
  // "2026-08-17T00:00:00.000Z") depending on how the backend serializes
  // Prisma's DateTime[] — normalize every entry down to its date-only part
  // so the request never 422s regardless of the exact upstream format.
  const eventDates = useMemo(
    () =>
      (selectedTicket?.eventDates ?? []).map((d) => {
        const parsed = parseISO(d);
        return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : d.slice(0, 10);
      }),
    [selectedTicket]
  );

  const { data, isLoading, isFetching, isError } = useCheckedInAttendees({
    eventDates,
    limit: PAGE_SIZE,
    cursor,
    direction,
  });

  const attendees = data?.data ?? [];
  const meta = data?.meta;
  const showLoadingOverlay = isFetching && !isLoading;

  // The checked-in attendees API has no search query param, so the search
  // box filters client-side within the currently-loaded page only.
  const visibleAttendees = attendees.filter((a) => {
    if (!searchInput.trim()) return true;
    const q = searchInput.trim().toLowerCase();
    return (
      a.attendeeFullName.toLowerCase().includes(q) ||
      a.attendeeEmail.toLowerCase().includes(q)
    );
  });

  const resetPagination = () => {
    setCursor(undefined);
    setDirection(undefined);
    setCursorStack([]);
  };

  const handleTicketChange = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    resetPagination();
  };

  const clearFilters = () => {
    setSearchInput('');
    setSelectedTicketId('');
    resetPagination();
  };

  const goNext = () => {
    if (!meta?.hasMore) return;
    setCursorStack((prev) => [...prev, cursor ?? '']);
    setCursor(attendees[attendees.length - 1]?.id);
    setDirection('next');
  };

  const goPrev = () => {
    const stack = [...cursorStack];
    const prevCursor = stack.pop();
    setCursorStack(stack);
    setCursor(prevCursor || undefined);
    setDirection(prevCursor ? 'previous' : undefined);
  };

  const handleExportCSV = () => {
    exportCSV(visibleAttendees, selectedTicket?.name);
    setExportOpen(false);
  };
  const handleExportPDF = () => {
    exportPDF(visibleAttendees, selectedTicket?.name);
    setExportOpen(false);
  };

  const noTicketSelected = !selectedTicketId;

  return (
    <>
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        {/* Search input — left-aligned */}
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[400px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search checked-in attendees"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent min-w-0"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="mr-3 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Ticket filter + export — right-aligned */}
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto w-full sm:w-auto">
          <TicketFilterDropdown
            tickets={tickets}
            loading={ticketsLoading}
            value={selectedTicketId}
            onChange={handleTicketChange}
          />

          {(searchInput || (selectedTicketId && selectedTicketId !== firstTicketId)) && (
            <button
              onClick={clearFilters}
              className="text-[12px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <X size={12} /> Clear filters
            </button>
          )}

          {/* Export dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setExportOpen((p) => !p)}
              disabled={noTicketSelected || visibleAttendees.length === 0}
              className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export"
            >
              <Download size={15} />
            </button>
            {exportOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setExportOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[130px]">
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 font-medium"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 font-medium"
                  >
                    Export as PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="relative border border-gray-200 rounded-xl overflow-hidden">
        {showLoadingOverlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 size={24} className="animate-spin text-gray-500" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="px-5 py-4 text-left text-[12px] font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noTicketSelected ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-16 text-[13px] text-gray-400">
                    Select a ticket above to view its checked-in attendees.
                  </td>
                </tr>
              ) : isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-12 text-[13px] text-red-400">
                    Failed to load checked-in attendees. Please refresh.
                  </td>
                </tr>
              ) : visibleAttendees.length === 0 ? (
                <EmptyState />
              ) : (
                visibleAttendees.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                      {a.attendeeFullName}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {a.attendeeEmail}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {a.ticket?.name ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-mono text-gray-700 whitespace-nowrap">
                      {a.ticket?.code ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {a.ticket?.validity ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-gray-800 whitespace-nowrap">
                      {a.amount ? `₦${parseFloat(a.amount).toLocaleString('en-NG')}` : '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {a.checkIns.length > 0
                        ? formatDateSafe(a.checkIns[a.checkIns.length - 1])
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — cursor based */}
        {!noTicketSelected && !isLoading && (cursorStack.length > 0 || meta?.hasMore) && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
            <span className="text-[12px] text-gray-400">
              {visibleAttendees.length} attendee{visibleAttendees.length === 1 ? '' : 's'} on this page
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={cursorStack.length === 0}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  cursorStack.length === 0
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={goNext}
                disabled={!meta?.hasMore}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  !meta?.hasMore
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
