'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Search, X } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import EmptyState from '@/app/_module/components/common/EmptyState';
import {
  useAuditLogActions,
  useAuditLogDetail,
  useAuditLogs,
} from '@/app/_module/services';
import type { AuditLogResponseDto } from '@/app/_module/api/types';

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
      <button
        type="button"
        aria-label="Close audit log details"
        className="flex-1 cursor-default bg-black/40"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-[17px] font-bold text-gray-900">Audit Log Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-5 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : isError || !data ? (
            <p className="text-[13px] text-red-400">Failed to load audit log details.</p>
          ) : (
            <div className="space-y-4">
              <DetailRow label="Log ID" value={data.id} />
              <DetailRow label="Action" value={data.action} />
              <DetailRow label="Admin" value={`${data.admin.fullName} (${data.admin.email})`} />
              <DetailRow label="Role" value={data.role?.name ?? data.admin.role?.name ?? '—'} />
              <DetailRow label="Created At" value={formatDate(data.createdAt)} />
              <div>
                <p className="mb-2 text-[12px] text-gray-400">Metadata</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-[12px] text-gray-700">
                  {data.metadata ? JSON.stringify(data.metadata, null, 2) : '—'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <span className="text-[12px] text-gray-400">{label}</span>
      <span className="text-right text-[13px] font-medium text-gray-800">{value}</span>
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
  const [menuId, setMenuId] = useState<string | null>(null);

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
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex w-full max-w-[480px] items-center overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-black/10 sm:flex-1">
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
        <select
          value={action}
          onChange={(event) => {
            setAction(event.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-200 bg-white px-3 py-[11px] text-[13px] text-gray-700 focus:outline-none"
        >
          <option value="">All actions</option>
          {(actionsData ?? []).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
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

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                {COLUMNS.map((column) => (
                  <th key={column} className="whitespace-nowrap px-5 py-4 text-left text-[13px] font-semibold text-[#121212]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={index} />)
              ) : isError ? (
                <tr><td colSpan={COLUMNS.length} className="py-12 text-center text-[13px] text-red-400">Failed to load audit logs. Please refresh.</td></tr>
              ) : logs.length === 0 ? (
                <EmptyState />
              ) : (
                logs.map((log: AuditLogResponseDto) => (
                  <tr key={log.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">{log.id}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">
                      <div>{log.admin.fullName}</div>
                      <div className="text-[11px] text-gray-400">{log.admin.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">{log.role?.name ?? log.admin.role?.name ?? '—'}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-800">{log.action}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-gray-600">{formatDate(log.createdAt)}</td>
                    <td className="relative px-5 py-4">
                      <button type="button" onClick={() => setMenuId(menuId === log.id ? null : log.id)} className="rounded-md p-1 hover:bg-gray-100">
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                      {menuId === log.id && (
                        <div className="absolute right-4 top-12 z-10 w-32 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLogId(log.id);
                              setMenuId(null);
                            }}
                            className="w-full rounded px-3 py-2 text-left text-[12px] text-gray-700 hover:bg-gray-50"
                          >
                            View details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && meta && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <span className="text-[12px] text-gray-400">Page {meta.page} of {meta.totalPages}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage((value) => value - 1)} disabled={!meta.hasPrevPage} className={cn('flex items-center gap-1 rounded-md border px-3 py-1.5 text-[12px]', meta.hasPrevPage ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'cursor-not-allowed border-gray-100 text-gray-300')}>
                <ChevronLeft size={14} /> Prev
              </button>
              <button type="button" onClick={() => setPage((value) => value + 1)} disabled={!meta.hasNextPage} className={cn('flex items-center gap-1 rounded-md border px-3 py-1.5 text-[12px]', meta.hasNextPage ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'cursor-not-allowed border-gray-100 text-gray-300')}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      <AuditLogDetails logId={selectedLogId} onClose={() => setSelectedLogId(null)} />
    </>
  );
}
