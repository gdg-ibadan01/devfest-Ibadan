'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, XCircle } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import {
  useCreateRole,
  useUpdateRole,
  usePermissions,
  useRole,
} from '@/app/_module/services';
import type { PermissionDto } from '@/app/_module/api/types';

// ── Permission type ────────────────────────────────────────────────────────────

type PermissionId = PermissionDto['id'];

// ── Checkbox ──────────────────────────────────────────────────────────────────

function PermissionCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 text-left border border-dashed border-[#D1D1D1] rounded-lg px-[10px] py-[8px]"
    >
      <span
        className={cn(
          'w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-colors',
          checked ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white hover:border-gray-500'
        )}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-gray-700">{label}</span>
    </button>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  description: string;
  permissions: PermissionId[];
}

interface Errors {
  name?: string;
  description?: string;
  permissions?: string;
}

const EMPTY_FORM: FormState = { name: '', description: '', permissions: [] };

// ── Props ─────────────────────────────────────────────────────────────────────

interface RoleFormModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  /** ID of the role being edited (required when mode === 'edit') */
  roleId?: string;
  initialData?: FormState;
  onClose: () => void;
  onSubmit: () => void; // notify parent on successful create/update
}

export default function RoleFormModal({
  open,
  mode,
  roleId,
  initialData,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});

  const { data: permsData, isLoading: permsLoading } = usePermissions();
  const { mutate: createRole, isPending: creating } = useCreateRole();
  const { mutate: updateRole, isPending: updating } = useUpdateRole();
  const { data: roleDetail, isLoading: roleLoading } = useRole(roleId ?? '');

  const isPending = creating || updating;
  const allPermissions: PermissionDto[] = permsData?.permissions ?? [];

  useEffect(() => {
    if (!open) return;
    // If editing and we have fresh role data, populate from API; fall back to initialData
    if (mode === 'edit' && roleDetail) {
      setForm({
        name: roleDetail.name || initialData?.name || '',
        description: roleDetail.description || initialData?.description || '',
        permissions: (roleDetail.permissions || []).map((p: any) => p.id as PermissionId),
      });
      setErrors({});
      return;
    }

    setForm(initialData ?? EMPTY_FORM);
    setErrors({});
  }, [open, initialData, mode, roleDetail]);

  const togglePermission = (id: PermissionId) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(id)
        ? f.permissions.filter((p) => p !== id)
        : [...f.permissions, id],
    }));
    setErrors((e) => ({ ...e, permissions: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Role name is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (form.permissions.length === 0) e.permissions = 'Please select at least one permission.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      permissions: form.permissions,
      isActive: true,
    };

    if (mode === 'add') {
      createRole(payload, { onSuccess: () => onSubmit() });
    } else if (roleId) {
      updateRole({ id: roleId, dto: payload }, { onSuccess: () => onSubmit() });
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  if (!open) return null;

  // Group permissions by category prefix
  const grouped = allPermissions.reduce<Record<string, PermissionDto[]>>((acc, p) => {
    const category = p.id.split('.')[0];
    const key = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={handleClose} aria-hidden />
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between px-[32px] py-[24px] bg-[#FAFAFA] border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">{mode === 'add' ? 'Add New Role' : 'Edit Role'}</h2>
          <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <XCircle size={25} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[30px] py-6 space-y-6">
          {/* Role Name */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">
              Role Name <span style={{ color: '#E61530' }}>*</span>
            </p>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((e) => ({ ...e, name: undefined })); }}
              placeholder="Input Role Name"
              className="w-full border rounded-[8px] p-[12px] text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none transition-colors bg-transparent"
              style={errors.name ? { borderColor: '#E61530' } : { borderColor: '#E6E6E6' }}
            />
            {errors.name && <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">
              Role Description <span style={{ color: '#E61530' }}>*</span>
            </p>
            <textarea
              value={form.description}
              onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setErrors((er) => ({ ...er, description: undefined })); }}
              placeholder="Description here"
              rows={4}
              className="w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none transition-colors resize-none bg-white"
              style={errors.description ? { borderColor: '#E61530' } : { borderColor: '#e5e7eb' }}
            />
            {errors.description && <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{errors.description}</p>}
          </div>

          {/* Permissions */}
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-1">
              Select Permissions <span style={{ color: '#E61530' }}>*</span>
            </p>
            {errors.permissions && <p className="mb-3 text-[12px]" style={{ color: '#E61530' }}>{errors.permissions}</p>}

            {permsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([groupName, perms]) => (
                  <div key={groupName}>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{groupName}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {perms.map((perm) => (
                        <PermissionCheckbox
                          key={perm.id}
                          label={perm.label}
                          checked={form.permissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-6 py-[10px] rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-[10px] rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving…' : mode === 'add' ? 'Create Role' : 'Save Changes'}
            {!isPending && <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
