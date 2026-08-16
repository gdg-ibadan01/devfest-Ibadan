'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, XCircle } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { RoleFormData } from '../_types/role.types';


export const PERMISSION_GROUPS: string[][] = [
  ['Create Tickets', 'Edit Tickets', 'Delete Tickets'],
  ['Manage all User Roles', 'Assign permissions to Users'],
  ['View Payment Reports', 'Export Payment Reports'],
  ['Manage Referral', 'Check in Attendees'],
  ['View Full Attendee List', 'Configure Event Settings'],
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flat();

const EMPTY_FORM: RoleFormData = {
  name: '',
  description: '',
  permissions: [],
};


function PermissionCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 text-left border border-dashed border-[#D1D1D1] rounded-lg px-[10px] py-[8px]"
    >
      <span
        className={cn(
          'w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-colors',
          checked
            ? 'bg-gray-900 border-gray-900'
            : 'border-gray-300 bg-white hover:border-gray-500'
        )}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-gray-700">{label}</span>
    </button>
  );
}


interface RoleFormModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData?: RoleFormData;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
}

export default function RoleFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [form, setForm] = useState<RoleFormData>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? EMPTY_FORM);
    }
  }, [open, initialData]);

  const togglePermission = (label: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(label)
        ? f.permissions.filter((p) => p !== label)
        : [...f.permissions, label],
    }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={handleClose} aria-hidden />

      {/* Panel */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px] h-[calc(100vh-20px)]">
        {/* Header */}
        <div className="flex items-center justify-between px-[32px] py-[24px] bg-[#FAFAFA] border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">
            {mode === 'add' ? 'Add New Role' : 'Edit Role'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <XCircle size={25} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[30px] py-6 space-y-6">
          {/* Role Name */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">
              Role Name
            </p>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Input Role Name"
              className="w-full border border-[#E6E6E6] rounded-[8px] p-[12px] text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-transparent"
            />
          </div>

          {/* Role Description */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">
              Role Description <span className="text-red-500">*</span>
            </p>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Description here"
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none bg-white"
            />
          </div>

          {/* Select Permissions */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-4">
              Select Permissions
            </p>
            <div className="flex flex-col">
              {PERMISSION_GROUPS.map((group, gi) => (
                <div key={gi} className="flex flex-wrap gap-x-6 gap-y-3 py-3">
                  {group.map((perm) => (
                    <PermissionCheckbox
                      key={perm}
                      label={perm}
                      checked={form.permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-[10px] rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(form)}
            className="flex items-center gap-2 px-6 py-[10px] rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition-colors"
          >
            Submit
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
