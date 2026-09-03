'use client';

import { useMemo } from 'react';
import { XCircle } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { useRoles } from '@/app/_module/services';
import type { FindAllAdminsItemDto, PermissionDto } from '@/app/_module/api/types';

interface AdminDetailModalProps {
  open: boolean;
  admin: FindAllAdminsItemDto | null;
  onClose: () => void;
  onDeactivate: () => void;
}

export const formatAdminDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'do MMM, yyyy, HH:mm') : iso;
};


function getInvitedByName(admin: FindAllAdminsItemDto): string | null {
  const raw = (admin as unknown as { invitedBy?: { name?: string } | null }).invitedBy;
  return raw?.name ?? null;
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

export default function AdminDetailModal({
  open,
  admin,
  onClose,
  onDeactivate,
}: AdminDetailModalProps) {
  const { data: rolesData, isLoading: rolesLoading } = useRoles();

  const permissionsByRoleName = useMemo(() => {
    const map = new Map<string, PermissionDto[]>();
    (rolesData?.roles ?? []).forEach((r) => map.set(r.name, r.permissions));
    return map;
  }, [rolesData]);

  if (!open || !admin) {
    return null;
  }

  const rolePermissions = permissionsByRoleName.get(admin.role?.name ?? '') ?? [];

  const invitedByName = getInvitedByName(admin);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px] h-[calc(100vh-20px)]">
        {/* Header */}
        <div className="flex items-center justify-between px-[32px] py-[24px] bg-[#FAFAFA] border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">Admin Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <XCircle size={25} color="#0D121C" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[30px] py-6">
          {/* Name heading */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[22px] font-bold text-gray-900">{admin.fullName}</h3>
            <StatusBadge isActive={admin.isActive} />
          </div>

          {/* Meta card */}
          <div className="border border-gray-200 rounded-xl p-5 mb-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Full Name</p>
                <p className="text-[13px] font-semibold text-gray-900">{admin.fullName}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Email Address</p>
                <p className="text-[13px] font-semibold text-gray-900 break-all">{admin.email}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Role</p>
                <p className="text-[13px] font-semibold text-gray-900">{admin.role?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Invited By</p>
                <p className="text-[13px] font-semibold text-gray-900">{invitedByName ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Date Joined</p>
                <p className="text-[13px] font-semibold text-gray-900">{formatAdminDate(admin.createdAt)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Last Updated</p>
                <p className="text-[13px] font-semibold text-gray-900">{formatAdminDate(admin.updatedAt)}</p>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <p className="text-[11px] text-gray-400 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {rolesLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <span
                      key={i}
                      className="px-3 py-[5px] border border-gray-200 rounded-md text-[12px] text-gray-700 bg-white w-24 h-6 animate-pulse"
                    />
                  ))
                ) : rolePermissions.length === 0 ? (
                  <span className="text-[13px] text-gray-400">No permissions assigned</span>
                ) : (
                  rolePermissions.map((perm) => (
                    <span
                      key={perm.id}
                      className="px-3 py-[5px] border border-gray-200 rounded-md text-[12px] text-gray-700 bg-white"
                    >
                      {perm.label}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onDeactivate}
            disabled={!admin.isActive}
            className="px-6 py-[10px] rounded-lg border border-red-400 text-red-500 text-[13px] font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
