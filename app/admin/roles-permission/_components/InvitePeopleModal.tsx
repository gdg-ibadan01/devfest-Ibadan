'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, XCircle } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import { PERMISSION_GROUPS } from './RoleFormModal';
import type { InviteFormData, RoleRecord } from '../_types/role.types';


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


interface InvitePeopleModalProps {
  open: boolean;
  roles: RoleRecord[];
  onClose: () => void;
  onSubmit: (data: InviteFormData) => void;
}

const EMPTY: InviteFormData = {
  role: '',
  fullName: '',
  email: '',
  permissions: [],
};


export default function InvitePeopleModal({
  open,
  roles,
  onClose,
  onSubmit,
}: InvitePeopleModalProps) {
  const [form, setForm] = useState<InviteFormData>(EMPTY);
  const [roleOpen, setRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  useEffect(() => {
    if (!roleOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [roleOpen]);

  const togglePermission = (label: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(label)
        ? f.permissions.filter((p) => p !== label)
        : [...f.permissions, label],
    }));
  };

  const handleClose = () => {
    setForm(EMPTY);
    setRoleOpen(false);
    onClose();
  };

  const allPermissions = PERMISSION_GROUPS.flat();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={handleClose} aria-hidden />

      {/* Panel */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px] h-[calc(100vh-20px)]">
        {/* Header */}
        <div className="flex items-center justify-between px-[32px] py-[24px] bg-[#FAFAFA] border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">Invite People</h2>
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
          {/* Role dropdown */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">Role</p>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRoleOpen((v) => !v)}
                className="w-full flex items-center justify-between border border-[#E6E6E6] rounded-[8px] px-[12px] py-[12px] text-[13px] bg-transparent focus:outline-none hover:border-gray-400 transition-colors"
              >
                <span className={form.role ? 'text-gray-800' : 'text-gray-300'}>
                  {form.role || 'Select Role'}
                </span>
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              </button>
              {roleOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, role: r.name }));
                        setRoleOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-[13px] text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">Full Name</p>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Input Full Name"
              className="w-full border border-[#E6E6E6] rounded-[8px] p-[12px] text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-transparent"
            />
          </div>

          {/* Email Address */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">Email Address</p>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Input Email Address"
              className="w-full border border-[#E6E6E6] rounded-[8px] p-[12px] text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-transparent"
            />
          </div>

          {/* Select Permissions */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-4">Select Permissions</p>
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {allPermissions.map((perm) => (
                <PermissionCheckbox
                  key={perm}
                  label={perm}
                  checked={form.permissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                />
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
