'use client';

import { Trash2 } from 'lucide-react';

interface DeactivateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeactivateRoleModal({
  open,
  onClose,
  onConfirm,
}: DeactivateRoleModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl w-[400px] px-8 py-8 flex flex-col items-center gap-4 shadow-xl z-10">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" strokeWidth={1.8} />
        </div>
        <div className="text-center">
          <h2 className="text-[18px] font-bold text-gray-900 mb-1">
            Deactivate Role
          </h2>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Are you sure you want to deactivate this role?
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full mt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 rounded-xl bg-red-500 text-white text-[14px] font-semibold hover:bg-red-600 transition-colors"
          >
            Deactivate Role
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
