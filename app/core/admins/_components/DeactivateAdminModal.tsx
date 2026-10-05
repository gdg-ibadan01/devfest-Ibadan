'use client';

import { Trash2 } from 'lucide-react';
import { useDeactivateAdmin } from '@/app/_module/services';

interface DeactivateAdminModalProps {
  open: boolean;
  adminId?: string | null;
  adminName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeactivateAdminModal({
  open,
  adminId,
  adminName,
  onClose,
  onConfirm,
}: DeactivateAdminModalProps) {
  const { mutate, isPending } = useDeactivateAdmin();

  if (!open) return null;

  const handleConfirm = () => {
    if (!adminId) return;
    mutate(adminId, {
      onSuccess: () => {
        onConfirm();
      },
      onError: () => {},
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl w-[400px] p-[24px] flex flex-col items-center gap-4 shadow-xl z-10">
        <div className="w-[40px] h-[40px] rounded-[8px] bg-[#FBEEF0] flex items-center justify-center">
          <Trash2 size={24} className="text-[#EF2641]" strokeWidth={1.8} />
        </div>
        <div className="text-center">
          <h2 className="text-[18px] font-bold text-gray-900 mb-1">Deactivate Admin</h2>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Are you sure you want to deactivate {adminName ? <span className="font-medium text-gray-700">{adminName}</span> : 'this admin'}?
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full mt-1">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-[#E61530] text-white text-[14px] font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {isPending ? 'Deactivating…' : 'Deactivate Admin'}
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
