'use client';

import { X, ArrowRight } from 'lucide-react';
import type { RoleRecord } from '../_types/role.types';

interface RoleDetailModalProps {
  open: boolean;
  role: RoleRecord | null;
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

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="w-[480px] max-w-full h-screen bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">
            Role &amp; Permission
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Role name heading */}
          <h3 className="text-[22px] font-bold text-gray-900 mb-5">
            {role.name}
          </h3>

          {/* Meta card */}
          <div className="border border-gray-200 rounded-xl p-5 mb-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Role Name</p>
                <p className="text-[13px] font-semibold text-gray-900">
                  {role.name}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">
                  Declaration Date
                </p>
                <p className="text-[13px] font-semibold text-gray-900">
                  {role.declarationDate ?? 'Friday, Saturday'}
                </p>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <p className="text-[11px] text-gray-400 mb-2">Description</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="px-3 py-[5px] border border-gray-200 rounded-md text-[12px] text-gray-700 bg-white"
                  >
                    {perm}
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
