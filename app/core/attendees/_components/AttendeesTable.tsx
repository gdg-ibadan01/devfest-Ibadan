'use client';

import { useState, useCallback } from 'react';
import {
  Search,
  Download,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import type { OrderListItemDto } from '@/app/_module/api/types';
import type { OrderStatus } from '../_types/attendee.types';
import AttendeeActionsMenu from './AttendeeActionsMenu';
import EmptyState from '@/app/_module/components/common/EmptyState';
import { useOrders, useCheckInFilteredOrders } from '@/app/_module/services/order.service';

// ── Constants ─────────────────────────────────────────────────────────────────

// Check-in filter — the Attendees filter is based on check-in state rather
// than payment status (payment status filtering now lives in the Orders module).
type CheckInFilter = '' | 'CHECKED_IN' | 'NOT_CHECKED_IN';

const CHECKIN_FILTER_LABELS: Record<Exclude<CheckInFilter, ''>, string> = {
  CHECKED_IN: 'Checked In',
  NOT_CHECKED_IN: 'Not Checked In',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PAID: 'Paid',
  AWAITING_PAYMENT: 'Awaiting Payment',
  CANCELLED: 'Cancelled',
  AWAITING_REFUND: 'Awaiting Refund',
  REFUNDED: 'Refunded',
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { dot: string; text: string; bg: string }
> = {
  PAID: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]' },
  AWAITING_PAYMENT: {
    dot: 'bg-[#F59E0B]',
    text: 'text-[#92400E]',
    bg: 'bg-[#FEF3C7]',
  },
  CANCELLED: {
    dot: 'bg-[#EA4335]',
    text: 'text-[#C5221F]',
    bg: 'bg-[#FDECEA]',
  },
  AWAITING_REFUND: {
    dot: 'bg-[#F59E0B]',
    text: 'text-[#92400E]',
    bg: 'bg-[#FEF3C7]',
  },
  REFUNDED: { dot: 'bg-[#9AA0A6]', text: 'text-[#5F6368]', bg: 'bg-[#F1F3F4]' },
};

const COLUMNS = [
  'Full Name',
  'Email Address',
  'Ticket',
  'Code',
  'Validity',
  'Amount',
  'Status',
  'Check In',
  'Action',
];

const PAGE_SIZE = 15;

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.AWAITING_PAYMENT;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium whitespace-nowrap',
        cfg.bg,
        cfg.text
      )}
    >
      <span
        className={cn('w-[7px] h-[7px] rounded-full flex-shrink-0', cfg.dot)}
      />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// Check-in badge reuses the same colors as the payment-status badge:
// "Paid" green for checked-in, "Awaiting Payment" amber for not-checked-in.
function CheckInBadge({ checkedIn }: { checkedIn: boolean }) {
  const cfg = checkedIn ? STATUS_CONFIG.PAID : STATUS_CONFIG.AWAITING_PAYMENT;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium whitespace-nowrap',
        cfg.bg,
        cfg.text
      )}
    >
      <span
        className={cn('w-[7px] h-[7px] rounded-full flex-shrink-0', cfg.dot)}
      />
      {checkedIn ? 'Checked In' : 'Not Checked In'}
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

function CheckInFilterDropdown({
  value,
  onChange,
}: {
  value: CheckInFilter;
  onChange: (v: CheckInFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-5 py-[11px] border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        {value ? CHECKIN_FILTER_LABELS[value] : 'Check-in Status'}{' '}
        <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 sm:left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
            <button
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50',
                !value && 'font-semibold'
              )}
            >
              All
            </button>
            {(Object.keys(CHECKIN_FILTER_LABELS) as Exclude<CheckInFilter, ''>[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 whitespace-nowrap',
                    value === s && 'font-semibold'
                  )}
                >
                  {CHECKIN_FILTER_LABELS[s]}
                </button>
              )
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
  return isValid(d) ? format(d, 'dd MMM yyyy') : iso;
}

function exportRows(rows: OrderListItemDto[]) {
  return rows.map((o) => [
    o.attendeeFullName,
    o.attendeeEmail,
    o.ticket?.name ?? '',
    o.ticket?.code ?? '',
    o.ticket?.validity ?? '',
    o.amount,
    STATUS_LABELS[o.status as OrderStatus] ?? o.status,
    o.checkIns.length > 0
      ? formatDateSafe(o.checkIns[o.checkIns.length - 1])
      : 'Not checked in',
  ]);
}

function exportCSV(rows: OrderListItemDto[]) {
  const headers = [
    'Full Name',
    'Email',
    'Ticket',
    'Code',
    'Validity',
    'Amount',
    'Status',
    'Check In',
  ];
  const lines = exportRows(rows).map((row) =>
    row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
  );

  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendees-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(rows: OrderListItemDto[]) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape' });
  doc.text('Attendees List', 14, 14);

  autoTable(doc, {
    startY: 22,
    head: [
      [
        'Full Name',
        'Email',
        'Ticket',
        'Code',
        'Validity',
        'Amount',
        'Status',
        'Check In',
      ],
    ],
    body: exportRows(rows),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [20, 20, 20] },
  });

  doc.save(`attendees-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

// ── Main Table ────────────────────────────────────────────────────────────────

interface AttendeesTableProps {
  onCheckIn: (order: OrderListItemDto) => void;
  /** ID of the order currently being checked in, if any — shows a per-row loader. */
  checkingInOrderId?: string;
}

export default function AttendeesTable({
  onCheckIn,
  checkingInOrderId,
}: AttendeesTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInFilter, setCheckInFilter] = useState<CheckInFilter>('');
  const isFiltering = checkInFilter !== '';

  // Unfiltered pagination state (checkInFilter === '') — a single /orders
  // page, exactly as before.
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<'next' | 'previous' | undefined>(
    undefined
  );
  // History of cursors visited while paging forward — lets "Prev" always
  // walk back to the exact page it came from (including the true first
  // page), instead of relying on the API's `prevCursor`, which doesn't
  // reliably resolve back to page one.
  const [cursorStack, setCursorStack] = useState<string[]>([]);

  // Check-in-filtered ("scan") pagination state — used whenever a check-in
  // filter is active. The /orders API has no check-in filter param, so we
  // scan sequential /orders pages accumulating matches (see
  // useCheckInFilteredOrders in order.service.ts) instead of naively
  // filtering whatever single page happens to be loaded — the latter is
  // what caused "Checked In" to appear empty even when checked-in
  // attendees existed, just not on the currently-loaded page.
  const [scanCursor, setScanCursor] = useState<string | undefined>(undefined);
  const [scanCursorStack, setScanCursorStack] = useState<string[]>([]);

  const [exportOpen, setExportOpen] = useState(false);

  const unfilteredResult = useOrders(
    {
      limit: PAGE_SIZE,
      search: searchQuery || undefined,
      cursor,
      direction,
    },
    { enabled: !isFiltering }
  );

  const filteredResult = useCheckInFilteredOrders({
    search: searchQuery || undefined,
    checkedIn: checkInFilter === 'CHECKED_IN',
    cursor: scanCursor,
    pageSize: PAGE_SIZE,
    enabled: isFiltering,
  });

  const { isLoading, isFetching, isError } = isFiltering
    ? filteredResult
    : unfilteredResult;

  // Orders to render — already fully filtered server-side-equivalent by the
  // scan when a check-in filter is active, or the raw unfiltered page
  // otherwise. No further client-side filtering needed here.
  const visibleOrders = isFiltering
    ? filteredResult.data?.data ?? []
    : unfilteredResult.data?.data ?? [];

  const hasMore = isFiltering
    ? filteredResult.data?.hasMore ?? false
    : unfilteredResult.data?.meta?.hasMore ?? false;

  const hasPrev = isFiltering
    ? scanCursorStack.length > 0
    : cursorStack.length > 0;

  const scanLimitReached = isFiltering && filteredResult.data?.scanLimitReached;

  const showLoadingOverlay = isFetching && !isLoading;

  const hasFilters = !!(searchQuery || checkInFilter);

  const resetPagination = () => {
    setCursor(undefined);
    setDirection(undefined);
    setCursorStack([]);
    setScanCursor(undefined);
    setScanCursorStack([]);
  };

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
    resetPagination();
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setCheckInFilter('');
    resetPagination();
  };

  const goNext = () => {
    if (!hasMore) return;
    if (isFiltering) {
      setScanCursorStack((prev) => [...prev, scanCursor ?? '']);
      setScanCursor(filteredResult.data?.resumeCursor);
      return;
    }
    setCursorStack((prev) => [...prev, cursor ?? '']);
    setCursor(unfilteredResult.data?.data[unfilteredResult.data.data.length - 1]?.id);
    setDirection('next');
  };

  const goPrev = () => {
    if (isFiltering) {
      const stack = [...scanCursorStack];
      const prevCursor = stack.pop();
      setScanCursorStack(stack);
      setScanCursor(prevCursor || undefined);
      return;
    }
    const stack = [...cursorStack];
    const prevCursor = stack.pop();
    setCursorStack(stack);
    setCursor(prevCursor || undefined);
    // Once the stack empties we're back on the true first page — reset
    // direction too so the query params exactly match the initial fetch.
    setDirection(prevCursor ? 'previous' : undefined);
  };

  const handleExportCSV = () => {
    exportCSV(visibleOrders);
    setExportOpen(false);
  };
  const handleExportPDF = () => {
    exportPDF(visibleOrders);
    setExportOpen(false);
  };

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
            onKeyDown={handleKeyDown}
            placeholder="Search for attendee"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent min-w-0"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                resetPagination();
              }}
              className="mr-3 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={showLoadingOverlay}
          className="flex items-center justify-center gap-1.5 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors disabled:opacity-60"
        >
          {showLoadingOverlay && <Loader2 size={14} className="animate-spin" />}
          Search
        </button>

        {/* Check-in filter + export — right-aligned */}
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto w-full sm:w-auto">
          <CheckInFilterDropdown
            value={checkInFilter}
            onChange={(v) => {
              setCheckInFilter(v);
              resetPagination();
            }}
          />

          {hasFilters && (
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
              className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
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
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="text-center py-12 text-[13px] text-red-400"
                  >
                    Failed to load attendees. Please refresh.
                  </td>
                </tr>
              ) : visibleOrders.length === 0 ? (
                <EmptyState />
              ) : (
                visibleOrders.map((order) => {
                  const checkedIn = order.checkIns.length > 0;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                        {order.attendeeFullName}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                        {order.attendeeEmail}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                        {order.ticket?.name ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-mono text-gray-700 whitespace-nowrap">
                        {order.ticket?.code ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                        {order.ticket?.validity ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-gray-800 whitespace-nowrap">
                        {order.amount
                          ? `₦${parseFloat(order.amount).toLocaleString('en-NG')}`
                          : '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status as OrderStatus} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <CheckInBadge checkedIn={checkedIn} />
                        {/* {checkedIn && (
                          <span className="block mt-1 text-[11px] text-gray-400">
                            {formatDateSafe(
                              order.checkIns[order.checkIns.length - 1]
                            )}
                          </span>
                        )} */}
                      </td>
                      <td
                        className="px-5 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AttendeeActionsMenu
                          onCheckIn={() => onCheckIn(order)}
                          disabled={checkedIn}
                          loading={checkingInOrderId === order.id}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — cursor based */}
        {!isLoading && (hasPrev || hasMore) && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
            <span className="text-[12px] text-gray-400">
              {visibleOrders.length} attendee{visibleOrders.length === 1 ? '' : 's'} on this
              page
              {scanLimitReached && (
                <span className="ml-2 text-amber-500">
                  (showing partial results — try narrowing your search)
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={!hasPrev}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  !hasPrev
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={goNext}
                disabled={!hasMore}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  !hasMore
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
