'use client';

import { ArrowRight, XCircle } from 'lucide-react';
import { useRole } from '@/app/_module/services/roles.service';
import type { ListRolesItemResponseDto } from '@/app/_module/api/types';
import { formatCreatedAt } from './RolesTable';

interface RoleDetailModalProps {
  open: boolean;
  role: ListRolesItemResponseDto | null;
  onClose: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}

export default function RoleDetailModal({
  open,
  role,
  onClose,
  onEdit,
  onDeactivate,
}: RoleDetailModalProps) {
  if (!open || !role) return null;

  const { data, isLoading } = useRole(role.id);

  const roleData =
    data ??
    ({
      id: role.id,
      name: role.name,
      description: '',
      permissions: (Array.isArray(role.permissions)
        ? role.permissions
        : []
      ).map((p: any) => (typeof p === 'string' ? { id: p, label: p } : p)),
      createdAt: (role as any).createdAt ?? '',
      declarationDate: '',
      isActive: (role as any).isActive ?? false,
    } as any);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px] h-[calc(100vh-20px)]">
        {/* Header */}
        <div className="flex items-center justify-between px-[32px] py-[24px] bg-[#FAFAFA] border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">
            Role &amp; Permission
          </h2>
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
          {/* Role name heading */}
          <h3 className="text-[22px] font-bold text-gray-900 mb-5">
            {isLoading ? (
              <span className="w-40 h-6 bg-gray-100 rounded block animate-pulse" />
            ) : (
              roleData.name
            )}
          </h3>

          {/* Meta card */}
          <div className="border border-gray-200 rounded-xl p-5 mb-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Role Name</p>
                <p className="text-[13px] font-semibold text-gray-900">
                  {isLoading ? (
                    <span className="w-28 h-4 bg-gray-100 rounded block animate-pulse" />
                  ) : (
                    roleData.name
                  )}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">
                  Declaration Date
                </p>
                <p className="text-[13px] font-semibold text-gray-900">
                  {isLoading ? (
                    <span className="w-36 h-4 bg-gray-100 rounded block animate-pulse" />
                  ) : roleData.createdAt ? (
                    formatCreatedAt(roleData.createdAt)
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-[11px] text-gray-400 mb-2">Description</p>
              <p className="text-[13px] text-gray-700">
                {isLoading ? (
                  <span className="w-full h-12 bg-gray-100 rounded block animate-pulse" />
                ) : (
                  roleData.description || 'No description'
                )}
              </p>
            </div>

            {/* Permissions */}
            <div>
              <p className="text-[11px] text-gray-400 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <span
                        key={i}
                        className="px-3 py-[5px] border border-gray-200 rounded-md text-[12px] text-gray-700 bg-white w-24 h-6 animate-pulse"
                      />
                    ))
                  : roleData.permissions.map((perm: any) => (
                      <span
                        key={perm.id || perm}
                        className="px-3 py-[5px] border border-gray-200 rounded-md text-[12px] text-gray-700 bg-white"
                      >
                        {perm.label ?? perm}
                      </span>
                    ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onDeactivate}
            disabled={isLoading || !roleData.isActive}
            className="px-6 py-[10px] rounded-lg border border-red-400 text-red-500 text-[13px] font-medium hover:bg-red-50 transition-colors"
          >
            Deactivate
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-[10px] rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition-colors"
          >
            Edit
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
