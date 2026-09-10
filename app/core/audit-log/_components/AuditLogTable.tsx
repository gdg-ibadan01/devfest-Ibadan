'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import EmptyState from '@/app/_module/components/common/EmptyState';
import {
  useAuditLogActions,
  useAuditLogDetail,
  useAuditLogs,
} from '@/app/_module/services';
import type { AuditLogResponseDto } from '@/app/_module/api/types';
import { XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Ellipsis from '@/app/_module/components/icons/Ellipsis';

const COLUMNS = ['Log ID', 'Admin', 'Role', 'Action', 'Date', ''];

function formatDate(value: string): string {
  const date = parseISO(value);
  return isValid(date) ? format(date, 'dd MMM yyyy, h:mm a') : value;
}

function AuditLogDetails({
  logId,
  onClose,
}: {
  logId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useAuditLogDetail(logId);

  if (!logId) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden />
      {/* Panel */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px] h-[calc(100vh-20px)]">
        <div className="flex items-center justify-between bg-[#FAFAFA] px-6 py-5">
          <h2 className="text-[17px] font-bold text-gray-900">
            Audit Log Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <XCircle size={25} color="#0D121C" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-5 animate-pulse rounded bg-gray-100"
                />
              ))}
            </div>
          ) : isError || !data ? (
            <p className="text-[13px] text-red-400">
              Failed to load audit log details.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-4">
                <DetailRow label="Log ID" value={data.id} />
                <DetailRow label="Action" value={data.action} />
                <DetailRow
                  label="Admin"
                  value={`${data.admin.fullName} (${data.admin.email})`}
                />
                <DetailRow
                  label="Role"
                  value={data.role?.name ?? data.admin.role?.name ?? '—'}
                />
                <DetailRow
                  label="Created At"
                  value={formatDate(data.createdAt)}
                />
              </div>
              <div>
                <p className="mb-2 text-[12px] font-medium text-gray-500">
                  Metadata
                </p>
                <pre className="overflow-x-auto rounded-xl bg-gray-50 p-4 text-[12px] text-gray-700">
                  {data.metadata ? JSON.stringify(data.metadata, null, 2) : '—'}
                </pre>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 first:pt-0 last:border-0 last:pb-0">
      <span className="text-[12px] text-gray-400">{label}</span>
      <span className="text-right text-[13px] font-medium text-gray-800">
        {value}
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {COLUMNS.map((column) => (
        <td key={column} className="px-5 py-4">
          <div className="h-3 w-3/4 rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}

export default function AuditLogTable() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  const { data: actionsData } = useAuditLogActions();
  const { data, isLoading, isFetching, isError } = useAuditLogs({
    page,
    limit: 10,
    search: search || undefined,
    action: action || undefined,
    sortOrder: 'desc',
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;
  const loading = isLoading || isFetching;

  const applySearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setAction('');
    setPage(1);
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="flex w-full max-w-[480px] items-center overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-black/10 sm:w-[360px]">
            <Search size={15} className="ml-4 flex-shrink-0 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') applySearch();
              }}
              placeholder="Search admin or action"
              className="flex-1 bg-transparent px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={applySearch}
            className="rounded-md bg-gray-900 px-5 py-[11px] text-[13px] font-medium text-white hover:bg-black"
          >
            Search
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
          <button
            type="button"
            onClick={() => setActionMenuOpen((open) => !open)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-5 py-[11px] text-[13px] font-medium text-gray-700 hover:bg-gray-50"
          >
            {action || 'Action'} <ChevronDown size={14} />
          </button>
          {actionMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActionMenuOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[190px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setAction('');
                    setPage(1);
                    setActionMenuOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50',
                    !action && 'font-semibold'
                  )}
                >
                  All actions
                </button>
                {(actionsData ?? []).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setAction(item);
                      setPage(1);
                      setActionMenuOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50',
                      action === item && 'font-semibold'
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
          {(search || action) && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-500"
          >
            <X size={12} /> Clear filters
          </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-5 py-4 text-left text-[13px] font-semibold text-[#121212]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : isError ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="py-12 text-center text-[13px] text-red-400"
                  >
                    Failed to load audit logs. Please refresh.
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <EmptyState />
              ) : (
                logs.map((log: AuditLogResponseDto) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">
                      {log.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">
                      <div>{log.admin.fullName}</div>
                      <div className="text-[11px] text-gray-400">
                        {log.admin.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">
                      {log.role?.name ?? log.admin.role?.name ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">
                      {log.action}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-600">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-gray-100">
                            <Ellipsis />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={() => setSelectedLogId(log.id)}
                            className="cursor-pointer text-[13px]"
                          >
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && meta && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <span className="text-[12px] text-gray-400">
              Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => value - 1)}
                disabled={!meta.hasPrevPage}
                className={cn(
                  'flex items-center gap-1 rounded-md border px-3 py-1.5 text-[12px]',
                  meta.hasPrevPage
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'cursor-not-allowed border-gray-100 text-gray-300'
                )}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((value) => value + 1)}
                disabled={!meta.hasNextPage}
                className={cn(
                  'flex items-center gap-1 rounded-md border px-3 py-1.5 text-[12px]',
                  meta.hasNextPage
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'cursor-not-allowed border-gray-100 text-gray-300'
                )}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      <AuditLogDetails
        logId={selectedLogId}
        onClose={() => setSelectedLogId(null)}
      />
    </>
  );
}
