'use client';

import { useState, useCallback } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import { useDiscounts } from '@/app/_module/services/discounts.service';
import EmptyState from '@/app/_module/components/common/EmptyState';
import type { DiscountListItemDto } from '@/app/_module/api/types';

const STATUS_CONFIG: Record<
  DiscountListItemDto['status'],
  { dot: string; text: string; bg: string; label: string }
> = {
  ACTIVE: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]', label: 'Active' },
  SCHEDULED: { dot: 'bg-[#F59E0B]', text: 'text-[#92400E]', bg: 'bg-[#FEF3C7]', label: 'Scheduled' },
};

const COLUMNS = [
  'Discount Name',
  'Type',
  'Amount',
  'Tickets',
  'Usage',
  'Valid From',
  'Status',
];

function formatAmount(val: string): string {
  const num = parseFloat(val);
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

interface DiscountTableProps {
  onCreateClick: () => void;
}

export default function DiscountTable({ onCreateClick }: DiscountTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<'next' | 'previous' | undefined>(undefined);
  const [cursorStack, setCursorStack] = useState<string[]>([]);

  const { data, isLoading, isError, isFetching } = useDiscounts({
    name: searchQuery || undefined,
    cursor,
    direction,
    limit: 15,
  });

  const discounts = data?.data ?? [];
  const meta = data?.meta;

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
    if (!meta?.hasMore || discounts.length === 0) return;
    setCursorStack((prev) => [...prev, cursor ?? '']);
    setCursor(discounts[discounts.length - 1].id);
    setDirection('next');
  };

  const handlePrevPage = () => {
    const stack = [...cursorStack];
    const prev = stack.pop();
    setCursorStack(stack);
    setCursor(prev || undefined);
    // Once the stack is empty we're back on the true first page — reset
    // direction too so the query params exactly match the initial fetch.
    setDirection(prev ? 'previous' : undefined);
  };

  const hasData = discounts.length > 0;
  const showLoading = isLoading || isFetching;

  return (
    <>
      {/* Search + Actions bar */}
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search discounts by name"
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
          className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors"
        >
          Search
        </button>

        <div className="sm:ml-auto w-full sm:w-auto">
          <button
            onClick={onCreateClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Create Discount
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-4 text-[12px] font-semibold text-[#121212] whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {showLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-12 text-[13px] text-red-400">
                    Failed to load discounts. Please refresh.
                  </td>
                </tr>
              ) : !hasData ? (
                <EmptyState />
              ) : (
                discounts.map((discount) => {
                  const badge = STATUS_CONFIG[discount.status] ?? STATUS_CONFIG.SCHEDULED;
                  return (
                    <tr
                      key={discount.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-[13px] text-gray-800 font-medium">
                        {discount.name}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600">
                        {discount.type === 'SINGLE' ? 'Single Use' : 'Bulk'}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-700">
                        {formatAmount(discount.amount)}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600">
                        {discount.tickets.length > 0
                          ? discount.tickets.map((t) => t.name).join(', ')
                          : '—'}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600">
                        {discount.usage}
                        {discount.limit != null ? ` / ${discount.limit}` : ''}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600">
                        {formatDate(discount.validFrom)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'flex items-center gap-[5px] px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium',
                            badge.bg,
                            badge.text
                          )}
                        >
                          <span className={cn('w-[7px] h-[7px] rounded-full flex-shrink-0', badge.dot)} />
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!showLoading && (meta?.hasMore || cursorStack.length > 0) && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
            <span className="text-[12px] text-gray-400">
              {discounts.length} discount{discounts.length !== 1 ? 's' : ''} shown
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
    </>
  );
}
