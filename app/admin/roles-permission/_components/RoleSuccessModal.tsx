'use client';
import Image from 'next/image';
import Success from '../../../_module/components/icons/success.svg';

interface RoleSuccessModalProps {
  open: boolean;
  onDashboard: () => void;
}

export default function RoleSuccessModal({
  open,
  onDashboard,
}: RoleSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative bg-white rounded-2xl w-[540px] p-[42px] flex flex-col items-center gap-5 shadow-xl z-10">
        {/* Illustration */}
        <Image src={Success} alt="Success" width={300} />

        <h2 className="text-[20px] font-bold text-gray-900">
          Role Edit Successful
        </h2>

        <button
          type="button"
          onClick={onDashboard}
          className="w-full py-3 rounded-lg bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors mt-2"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
