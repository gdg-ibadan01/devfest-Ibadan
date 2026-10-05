'use client';

import { useMemo, useState } from 'react';
import { Search, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isValid, parseISO, isSameDay } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import type { FindAllAdminsItemDto } from '@/app/_module/api/types';
import { useAdmins } from '@/app/_module/services';
import { DatePickerInput } from '@/app/_module/components/ui/DatePicker';
import AdminActionsMenu from './AdminActionsMenu';
import EmptyState from '@/app/_module/components/common/EmptyState';

// ── Constants ─────────────────────────────────────────────────────────────────

const COLUMNS = ['', 'Full Name', 'Email Address', 'Role', 'Status', 'Date Joined', 'Action'];
const PAGE_SIZE = 10;
// Admin lists are small — fetch generously so client-side date filtering &
// pagination (required since the API has no date query param) stay accurate.
const FETCH_LIMIT = 100;

export const formatAdminDate = (iso: string) => {
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'do MMM, yyyy, HH:mm') : iso;
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium bg-[#E8F5E9] text-[#1B873B]">
      <span className="w-[7px] h-[7px] rounded-full bg-[#34A853] flex-shrink-0" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium bg-[#FDECEA] text-[#C5221F]">
      <span className="w-[7px] h-[7px] rounded-full bg-[#EA4335] flex-shrink-0" /> Deactivated
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
      {COLUMNS.map((c, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

type StatusFilter = '' | 'active' | 'inactive';

function StatusDropdown({ value, onChange }: { value: StatusFilter; onChange: (v: StatusFilter) => void }) {
  const [open, setOpen] = useState(false);
  const labelMap: Record<StatusFilter, string> = { '': 'Status', active: 'Active', inactive: 'Deactivated' };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-5 py-[11px] border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        {labelMap[value]} <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[130px]">
            {(['', 'active', 'inactive'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className={cn('w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50', value === s && 'font-semibold')}
              >
                {labelMap[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Main Table 

interface AdminsTableProps {
  onRowClick: (admin: FindAllAdminsItemDto) => void;
  onDeactivate: (admin: FindAllAdminsItemDto) => void;
}

export default function AdminsTable({ onRowClick, onDeactivate }: AdminsTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading, isError } = useAdmins({
    page: 1,
    limit: FETCH_LIMIT,
    search: searchQuery || undefined,
  });


  const filtered = useMemo(() => {
    const allAdmins = data?.data ?? [];
    return allAdmins.filter((a) => {
      if (filterStatus === 'active' && a.isActive !== true) return false;
      if (filterStatus === 'inactive' && a.isActive !== false) return false;
      if (filterDate) {
        const target = parseISO(filterDate);
        if (isValid(target)) {
          const created = parseISO(a.createdAt);
          if (!isValid(created) || !isSameDay(created, target)) return false;
        }
      }
      return true;
    });
  }, [data, filterDate, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!(searchQuery || filterDate || filterStatus);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

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

  const allChecked = paged.length > 0 && paged.every((a) => selected.has(a.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(paged.map((a) => a.id)));
  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 gap-y-2 mb-6">
        {/* Left: search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center w-full sm:w-[320px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
            <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for admin"
              className="flex-1 min-w-0 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
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
            className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* status and date filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:justify-end">
          <StatusDropdown
            value={filterStatus}
            onChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          />

          <div className="w-full sm:w-[180px]">
            <DatePickerInput
              value={filterDate}
              onChange={(v) => {
                setFilterDate(v);
                setPage(1);
              }}
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

      {/* Table */}
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
                    className="px-5 py-4 text-left text-[12px] font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="text-center py-12 text-[13px] text-red-400"
                  >
                    Failed to load admins. Please refresh.
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <EmptyState />
              ) : (
                paged.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => onRowClick(admin)}
                  >
                    <td
                      className="px-5 py-4 w-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selected.has(admin.id)}
                        onChange={() => toggleOne(admin.id)}
                      />
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-800 whitespace-nowrap">
                      {admin.fullName}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {admin.email}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-700 whitespace-nowrap">
                      {admin.role?.name ?? '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge isActive={admin.isActive} />
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {formatAdminDate(admin.createdAt)}
                    </td>
                    <td
                      className="px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AdminActionsMenu
                        onViewDetails={() => onRowClick(admin)}
                        onDeactivate={() => onDeactivate(admin)}
                        disableDeactivate={!admin.isActive}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filtered.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
            <span className="text-[12px] text-gray-400">
              Page {page} of {totalPages} · {filtered.length} admins
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  page <= 1
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] transition-colors',
                  page >= totalPages
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
