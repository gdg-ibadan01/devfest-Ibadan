'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { RoleRecord, RoleStatus } from '../_types/role.types';
import RoleActionsMenu from './RoleActionsMenu';
import EmptyState from '@/app/_module/components/common/EmptyState';
import MOCK_ROLES from './MockData';

const statusConfig: Record<
  RoleStatus,
  { dot: string; text: string; bg: string }
> = {
  Active: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]' },
  Deactivated: {
    dot: 'bg-[#EA4335]',
    text: 'text-[#C5221F]',
    bg: 'bg-[#FDECEA]',
  },
};

const MAX_VISIBLE = 2;

function PermissionTags({ permissions }: { permissions: string[] }) {
  const visible = permissions.slice(0, MAX_VISIBLE);
  const overflow = permissions.length - MAX_VISIBLE;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visible.map((p) => (
        <span
          key={p}
          className="px-2 py-[3px] border border-gray-200 rounded text-[11px] text-gray-600 bg-white whitespace-nowrap"
        >
          {p}
        </span>
      ))}
      {overflow > 0 && (
        <span className="px-2 py-[3px] bg-gray-100 rounded text-[11px] text-gray-500 font-medium">
          +{overflow}
        </span>
      )}
    </div>
  );
}

const COLUMNS = ['', 'Role', 'Permissions', 'Status', 'Date Created', 'Action'];

interface RolesTableProps {
  onAddRole: () => void;
  onInvite: () => void;
  onRowClick: (role: RoleRecord) => void;
  onEdit: (role: RoleRecord) => void;
  onDeactivate: (role: RoleRecord) => void;
}

export default function RolesTable({
  onAddRole,
  onInvite,
  onRowClick,
  onEdit,
  onDeactivate,
}: RolesTableProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_ROLES.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );
  const hasData = filtered.length > 0;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Search + Actions bar */}
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for ticket"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        <button className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors">
          Search
        </button>

        <div className="sm:ml-auto flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {hasData && (
            <button
              onClick={onInvite}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-[11px] border border-gray-300 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Invite People
              <Plus size={16} strokeWidth={2.5} />
            </button>
          )}
          <button
            onClick={onAddRole}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Add New Role
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
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  className="text-left px-5 py-4 text-[13px] font-semibold text-[#121212] whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasData ? (
              <EmptyState />
            ) : (
              filtered.map((role) => {
                const badge = statusConfig[role.status];
                const isChecked = selected.has(role.id);

                return (
                  <tr
                    key={role.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(role);
                    }}
                  >
                    <td
                      className="px-5 py-4 w-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSelect(role.id)}
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                          isChecked
                            ? 'bg-gray-900 border-gray-900'
                            : 'border-gray-300 bg-white hover:border-gray-500'
                        )}
                      >
                        {isChecked && (
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
                            <path
                              d="M1 4L3 6L7 2"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-[13px] text-gray-800 font-medium whitespace-nowrap">
                      {role.name}
                    </td>

                    <td className="px-5 py-4 max-w-[360px]">
                      <PermissionTags permissions={role.permissions} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'flex items-center gap-[2px] px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium',
                          badge.bg,
                          badge.text
                        )}
                      >
                        <span
                          className={cn(
                            'w-[8px] h-[8px] rounded-[1.3px]',
                            badge.dot
                          )}
                        />
                        <span
                          className={cn(
                            'w-[6px] h-[6px] rounded-full flex-shrink-0'
                          )}
                        />
                        {role.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {role.dateCreated}
                    </td>

                    <td
                      className="px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RoleActionsMenu
                        onDeactivate={() => onDeactivate(role)}
                        onEdit={() => onEdit(role)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}
