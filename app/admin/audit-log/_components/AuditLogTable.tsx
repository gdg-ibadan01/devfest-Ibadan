'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import { useAuditLogs } from '@/app/_module/services';
import EmptyState from '@/app/_module/components/common/EmptyState';

const COLUMNS = ['Log ID', 'Team', 'Role', 'Action', 'Time', 'Date'];
const PAGE_SIZE = 10;

/** Format timestamp safely into time string "10:24:28" */
function formatTimeSafe(dateStr?: string | Date): string {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(d) ? format(d, 'HH:mm:ss') : '—';
  } catch {
    return '—';
  }
}

/** Format timestamp safely into date string "15th March, 2025" */
function formatDateSafe(dateStr?: string | Date): string {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(d) ? format(d, 'do MMMM, yyyy') : '—';
  } catch {
    return '—';
  }
}

/** Format action code to readable human title (e.g., "CREATE_ATTENDEE" -> "Created Attendee") */
function formatAction(action: string): string {
  if (!action) return '—';
  const ACTION_MAP: Record<string, string> = {
    CREATE_ATTENDEE: 'Created Attendee',
    INVITE_ADMIN: 'Invited Admin',
    UPDATE_ROLE: 'Updated Role',
    CREATE_ROLE: 'Created Role',
    DEACTIVATE_ADMIN: 'Deactivated Admin',
    DEACTIVATE_ROLE: 'Deactivated Role',
    UPDATE_PROFILE: 'Updated Profile',
    CREATE_TICKET: 'Created Ticket',
    UPDATE_TICKET: 'Updated Ticket',
  };

  if (ACTION_MAP[action]) {
    return ACTION_MAP[action];
  }

  // Fallback: title case snake_case or SCREAMING_SNAKE_CASE
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Generate display log ID */
function formatLogId(id: string): string {
  if (!id) return 'LOG-—';
  const cleanId = id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase();
  return `LOG-${cleanId}`;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {COLUMNS.map((col) => (
        <td key={col} className="px-5 py-4">
          <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function AuditLogTable() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: response, isLoading, isError } = useAuditLogs({
    page,
    limit: PAGE_SIZE,
    search: query || undefined,
    sortOrder: 'desc',
  });

  const logs = response?.data ?? [];
  const meta = response?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalRecords = meta?.total ?? 0;

  const handleSearch = () => {
    setPage(1);
    setQuery(search.trim());
  };

  const handleClear = () => {
    setSearch('');
    setQuery('');
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      {/* Search bar */}
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[480px] border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by action, admin name or email"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors"
        >
          Search
        </button>
      </div>

      {/* Table card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {COLUMNS.map((col) => (
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-5 py-12 text-center text-sm text-red-600">
                    Failed to load audit logs. Please check your network and try again.
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <EmptyState />
              ) : (
                logs.map((log) => {
                  const adminName = log.admin?.fullName || '—';
                  const roleName = log.admin?.role?.name || log.role?.name || '—';

                  return (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 text-[13px] font-mono font-medium text-gray-800 whitespace-nowrap">
                        {formatLogId(log.id)}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-800 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{adminName}</span>
                        {log.admin?.email && (
                          <span className="block text-[11px] text-gray-400">{log.admin.email}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-700 whitespace-nowrap capitalize">
                        {roleName}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-900 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-gray-100 text-gray-800">
                          {formatAction(log.action)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                        {formatTimeSafe(log.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                        {formatDateSafe(log.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
            <span className="text-[12px] text-gray-500">
              Page {page} of {totalPages} · {totalRecords} total entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] font-medium transition-colors',
                  page <= 1
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                )}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md border text-[12px] font-medium transition-colors',
                  page >= totalPages
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
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
