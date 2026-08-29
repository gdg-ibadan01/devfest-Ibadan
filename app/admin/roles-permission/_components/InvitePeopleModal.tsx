'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, XCircle } from 'lucide-react';
import { useRoles } from '@/app/_module/services/roles.service';
import { useInviteAdmin } from '@/app/_module/services/admin.service';

interface InvitePeopleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void; // notify parent on success
}

const EMPTY = { roleId: '', fullName: '', email: '' };

export default function InvitePeopleModal({ open, onClose, onSubmit }: InvitePeopleModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [roleOpen, setRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const roles = rolesData?.roles ?? [];

  const invite = useInviteAdmin();

  useEffect(() => { if (open) setForm(EMPTY); }, [open]);

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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.roleId) e.roleId = 'Please select a role.';
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    invite.mutate({ fullName: form.fullName.trim(), email: form.email.trim(), roleId: form.roleId }, {
      onSuccess: () => {
        onSubmit();
        setForm(EMPTY);
      },
    });
  };

  const handleClose = () => { setForm(EMPTY); setRoleOpen(false); setErrors({}); onClose(); };

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
          <button type="button" onClick={handleClose} className="flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <XCircle size={25} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[30px] py-6 space-y-6">
          {/* Role dropdown */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">Role</p>
            <div className="relative" ref={dropdownRef}>
              <button type="button" onClick={() => setRoleOpen((v) => !v)} className={`w-full flex items-center justify-between border rounded-[8px] px-[12px] py-[12px] text-[13px] bg-transparent focus:outline-none hover:border-gray-400 transition-colors ${errors.roleId ? 'border-[#E61530]' : 'border-[#E6E6E6]'}`}>
                <span className={form.roleId ? 'text-gray-800' : 'text-gray-300'}>{form.roleId ? (roles.find((r:any) => r.id === form.roleId)?.name ?? 'Select Role') : 'Select Role'}</span>
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              </button>
              {roleOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden max-h-60 overflow-auto">
                  {rolesLoading ? (
                    <div className="p-4">Loading roles…</div>
                  ) : (
                    roles.map((r: any) => (
                      <button key={r.id} type="button" onClick={() => { setForm(f => ({ ...f, roleId: r.id })); setRoleOpen(false); }} className="w-full text-left px-4 py-3 text-[13px] text-gray-800 hover:bg-gray-50 transition-colors">
                        {r.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {errors.roleId && <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{errors.roleId}</p>}
          </div>

          {/* Full Name */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">Full Name</p>
            <input type="text" value={form.fullName} onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Input Full Name" className={`w-full border rounded-[8px] p-[12px] text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none transition-colors ${errors.fullName ? 'border-[#E61530]' : 'border-[#E6E6E6]'}`} />
            {errors.fullName && <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">Email Address</p>
            <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Input Email Address" className={`w-full border rounded-[8px] p-[12px] text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none transition-colors ${errors.email ? 'border-[#E61530]' : 'border-[#E6E6E6]'}`} />
            {errors.email && <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{errors.email}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={handleClose} className="px-6 py-[10px] rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={invite.isLoading} className="flex items-center gap-2 px-6 py-[10px] rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-50">
            {invite.isLoading ? 'Sending…' : 'Submit'}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
