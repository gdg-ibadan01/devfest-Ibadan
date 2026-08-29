'use client';

import { useState, useCallback } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/app/_module/lib/utils';
import type { ListRolesItemResponseDto } from '@/app/_module/api/types';
import { useRoles } from '@/app/_module/services';
import RoleActionsMenu from './RoleActionsMenu';
import EmptyState from '@/app/_module/components/common/EmptyState';

const MAX_VISIBLE_PERMS = 2;

function PermissionTags({ permissions }: { permissions: { id: string; label: string }[] }) {
  const visible = permissions.slice(0, MAX_VISIBLE_PERMS);
  const overflow = permissions.length - MAX_VISIBLE_PERMS;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visible.map((p) => (
        <span key={p.id} className="px-2 py-[3px] border border-gray-200 rounded text-[11px] text-gray-600 bg-white whitespace-nowrap">
          {p.label}
        </span>
      ))}
      {overflow > 0 && (
        <span className="px-2 py-[3px] bg-gray-100 rounded text-[11px] text-gray-500 font-medium">+{overflow}</span>
      )}
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] text-[11px] font-medium bg-[#E8F5E9] text-[#1B873B]">
      <span className="w-[7px] h-[7px] rounded-full bg-[#34A853] flex-shrink-0" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] text-[11px] font-medium bg-[#FDECEA] text-[#C5221F]">
      <span className="w-[7px] h-[7px] rounded-full bg-[#EA4335] flex-shrink-0" /> Deactivated
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {['', '', '', '', '', ''].map((_, i) => (
        <td key={i} className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
      ))}
    </tr>
  );
}

const COLUMNS = ['', 'Role', 'Permissions', 'Status', 'Date Created', 'Action'];

interface RolesTableProps {
  onAddRole: () => void;
  onInvite: () => void;
  onRowClick: (role: ListRolesItemResponseDto) => void;
  onEdit: (role: ListRolesItemResponseDto) => void;
  onDeactivate: (role: ListRolesItemResponseDto) => void;
}

export default function RolesTable({ onAddRole, onInvite, onRowClick, onEdit, onDeactivate }: RolesTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading, isError } = useRoles();

  const roles = data?.roles ?? [];

  // Client-side search filter
  const filtered = searchInput.trim()
    ? roles.filter((r) => r.name.toLowerCase().includes(searchInput.toLowerCase()))
    : roles;

  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const formatCreatedAt = (iso: string) => {
    const d = parseISO(iso);
    return isValid(d) ? format(d, "do MMM, yyyy, HH:mm") : iso;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for role"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="mr-3 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sm:ml-auto flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {roles.length > 0 && (
            <button
              onClick={onInvite}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-[11px] border border-gray-300 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Invite People <Plus size={16} strokeWidth={2.5} />
            </button>
          )}
          <button
            onClick={onAddRole}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Add New Role <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {COLUMNS.map((col, i) => (
                  <th key={i} className="text-left px-5 py-4 text-[12px] font-semibold text-gray-700 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr><td colSpan={6} className="text-center py-12 text-[13px] text-red-400">Failed to load roles. Please refresh.</td></tr>
              ) : filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map((role) => (
                  <tr
                    key={role.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => onRowClick(role)}
                  >
                    <td className="px-5 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleOne(role.id)}
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                          selected.has(role.id) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white hover:border-gray-500'
                        )}
                      >
                        {selected.has(role.id) && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-800 font-medium whitespace-nowrap">{role.name}</td>
                    <td className="px-5 py-4 max-w-[360px]">
                      <PermissionTags permissions={role.permissions as { id: string; label: string }[]} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge isActive={role.isActive} />
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {formatCreatedAt(role.createdAt)}
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <RoleActionsMenu
                        onDeactivate={() => onDeactivate(role)}
                        onEdit={() => onEdit(role)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
