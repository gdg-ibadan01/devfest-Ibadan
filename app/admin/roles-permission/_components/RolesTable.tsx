'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { RoleRecord, RoleStatus } from '../_types/role.types';
import RoleActionsMenu from './RoleActionsMenu';

/* ------------------------------------------------------------------ */
/* Mock data                                                            */
/* ------------------------------------------------------------------ */
const ALL_PERMISSIONS_SAMPLE = [
  'Create Tickets',
  'Assign permissions to Users',
  'Export Payment Reports',
  'Delete Tickets',
  'Edit Tickets',
  'Manage all User Roles',
  'View Payment Reports',
  'Manage Referral',
  'Check in Attendees',
  'View Full Attendee List',
];

const MOCK_ROLES: RoleRecord[] = [
  {
    id: '1',
    name: 'Super Admin',
    description:
      'The Super Admin role has complete access and control across the entire organisation.',
    permissions: ALL_PERMISSIONS_SAMPLE,
    status: 'Active',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Friday, Saturday',
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Admin role with standard management permissions.',
    permissions: ALL_PERMISSIONS_SAMPLE.slice(0, 7),
    status: 'Active',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Friday',
  },
  {
    id: '3',
    name: 'Volunteer',
    description: 'Volunteer role with limited access.',
    permissions: ['Check in Attendees', 'View Full Attendee List'],
    status: 'Deactivated',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Saturday',
  },
  {
    id: '4',
    name: 'Volunteer',
    description: 'Volunteer role with limited access.',
    permissions: ['Check in Attendees', 'View Full Attendee List'],
    status: 'Deactivated',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Saturday',
  },
  {
    id: '5',
    name: 'Volunteer',
    description: 'Volunteer role with limited access.',
    permissions: ['Check in Attendees', 'View Full Attendee List'],
    status: 'Active',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Friday',
  },
];

/* ------------------------------------------------------------------ */
/* Status badge                                                         */
/* ------------------------------------------------------------------ */
const statusConfig: Record<RoleStatus, { dot: string; text: string; bg: string }> = {
  Active: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]' },
  Deactivated: { dot: 'bg-[#EA4335]', text: 'text-[#C5221F]', bg: 'bg-[#FDECEA]' },
};

/* ------------------------------------------------------------------ */
/* Permission tags with overflow badge                                  */
/* ------------------------------------------------------------------ */
const MAX_VISIBLE = 3;

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

/* ------------------------------------------------------------------ */
/* Empty state                                                          */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-[120px] h-[120px] flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect x="10" y="18" width="40" height="36" rx="3" fill="#E5E7EB" />
              <rect x="14" y="14" width="40" height="36" rx="3" fill="#F3F4F6" />
              <rect x="18" y="10" width="40" height="36" rx="3" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="26" y1="22" x2="50" y2="22" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="28" x2="50" y2="28" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="34" x2="40" y2="34" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="50" cy="46" r="12" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5" />
              <circle cx="50" cy="46" r="7" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="55" y1="53" x2="61" y2="59" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-gray-700">No Data</p>
            <p className="text-[12px] text-gray-400 mt-1">
              There is no data to
              <br />
              show you right now
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */
const COLUMNS = ['', 'Role', 'Permissions', 'Status', 'Date Created', 'Action'];

interface RolesTableProps {
  onAddRole: () => void;
  onRowClick: (role: RoleRecord) => void;
  onEdit: (role: RoleRecord) => void;
  onDeactivate: (role: RoleRecord) => void;
}

export default function RolesTable({
  onAddRole,
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
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center flex-1 max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
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

        <div className="ml-auto flex items-center gap-3">
          {hasData && (
            <button className="flex items-center gap-2 px-5 py-[11px] border border-gray-300 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Invite People
              <Plus size={16} strokeWidth={2.5} />
            </button>
          )}
          <button
            onClick={onAddRole}
            className="flex items-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Add New Role
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  className="text-left px-5 py-4 text-[12px] font-medium text-gray-500 whitespace-nowrap"
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
                    onClick={() => onRowClick(role)}
                  >
                    {/* Checkbox — stop propagation */}
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
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
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
                          'inline-flex items-center gap-[5px] px-3 py-[4px] rounded-full text-[11px] font-medium',
                          badge.bg,
                          badge.text
                        )}
                      >
                        <span className={cn('w-[6px] h-[6px] rounded-full', badge.dot)} />
                        {role.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                      {role.dateCreated}
                    </td>

                    {/* Action — stop row-click propagation */}
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
    </>
  );
}
