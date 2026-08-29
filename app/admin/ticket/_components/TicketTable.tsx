'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  format,
  isValid,
  parseISO,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';
import TicketActionsMenu from './TicketActionsMenu';
import TicketPreviewModal from './TicketPreviewModal';
import EmptyState from '@/app/_module/components/common/EmptyState';
import { DatePickerInput } from '@/app/_module/components/ui/DatePicker';
import { useTickets, useUpdateTicket } from '@/app/_module/services';
import type { TicketListItemDto } from '@/app/_module/api/types';
import { cn } from '@/app/_module/lib/utils';

const COLUMNS = [
  'Ticket Name',
  'Event Dates',
  'Price',
  'Discount',
  'Sale Start',
  'Sale End',
  'Capacity',
  'Action',
];

function formatAmount(val: string | number): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '—';
  return `₦${num.toLocaleString('en-NG')}`;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'dd MMM yyyy') : iso;
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

export default function TicketTable() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<'next' | 'prev' | undefined>(
    undefined
  );
  const [cursorStack, setCursorStack] = useState<string[]>([]);

  // Preview modal — only need the id; modal fetches its own full data
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTicketId, setPreviewTicketId] = useState<string | null>(null);

  const { mutate: updateTicket } = useUpdateTicket();

  const { data, isLoading, isError } = useTickets({
    name: searchQuery || undefined,
    cursor,
    direction,
    limit: 10,
  });

  const tickets = data?.data ?? [];
  const meta = data?.meta;

  // Client-side date filter on saleStartsAt
  const filtered = filterDate
    ? tickets.filter((t) => {
        const d = parseISO(t.saleStartsAt);
        const f = parseISO(filterDate);
        return isValid(d) && isValid(f) && (isAfter(d, f) || isEqual(d, f));
      })
    : tickets;

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
    setCursor(undefined);
    setDirection(undefined);
    setCursorStack([]);
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleNextPage = () => {
    if (!meta?.nextCursor) return;
    setCursorStack((prev) => [...prev, cursor ?? '']);
    setCursor(meta.nextCursor);
    setDirection('next');
  };

  const handlePrevPage = () => {
    const stack = [...cursorStack];
    const prev = stack.pop();
    setCursorStack(stack);
    setCursor(prev || undefined);
    setDirection('prev');
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setFilterDate('');
    setCursor(undefined);
    setDirection(undefined);
    setCursorStack([]);
  };

  const hasFilters = searchQuery || filterDate;

  return (
    <>
      {/* ---- Toolbar ---- */}
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        {/* Search */}
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for ticket"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
              }}
              className="mr-3 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="px-5 py-[11px] bg-black text-white text-[13px] font-medium rounded-md hover:bg-gray-900 transition-colors"
        >
          Search
        </button>

        <div className="sm:ml-auto flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <Link href="/admin/ticket/create" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto px-5 py-[11px] border border-gray-200 text-[13px] font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Plus size={18} /> Create Ticket
            </button>
          </Link>

          {/* Date filter */}
          <div className="w-full sm:w-[180px]">
            <DatePickerInput
              value={filterDate}
              onChange={setFilterDate}
              placeholder="Filter by date"
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-[12px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-4 text-[12px] font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="text-center py-12 text-[13px] text-red-400"
                  >
                    Failed to load tickets. Please refresh.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setPreviewTicketId(ticket.id);
                      setPreviewOpen(true);
                    }}
                  >
                    <td className="px-5 py-4 text-[13px] text-gray-800 font-medium">
                      {ticket.name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {(ticket?.eventDates ?? []).map((d) => (
                          <span
                            key={d}
                            className="px-2 py-1 rounded-sm border text-[12px] text-gray-600 bg-[#F3F3F3] whitespace-nowrap"
                          >
                            {formatDate(d)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-700">
                      {formatAmount(ticket.price)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-700">
                      {parseFloat(ticket.discount) > 0
                        ? formatAmount(ticket.discount)
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {formatDate(ticket.saleStartsAt)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {formatDate(ticket.saleEndsAt)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-700">
                      {ticket?.capacity?.toLocaleString()}
                    </td>
                    <td
                      className="px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TicketActionsMenu
                        onPreview={() => {
                          setPreviewTicketId(ticket.id);
                          setPreviewOpen(true);
                        }}
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && (meta?.hasMore || cursorStack.length > 0) && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
            <span className="text-[12px] text-gray-400">
              {filtered.length} ticket{filtered.length !== 1 ? 's' : ''} shown
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
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

      {/* ---- Preview Modal ---- */}
      {previewOpen && previewTicketId && (
        <TicketPreviewModal
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewTicketId(null);
          }}
          ticketId={previewTicketId}
        />
      )}
    </>
  );
}
