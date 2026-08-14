'use client';

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
      <div className="relative bg-white rounded-2xl w-[540px] px-12 py-12 flex flex-col items-center gap-5 shadow-xl z-10">
        {/* Illustration */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Decorative sparkles */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 144 144"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stars */}
            <text x="100" y="28" fontSize="14">✦</text>
            <text x="16" y="44" fontSize="10">✦</text>
            <text x="112" y="56" fontSize="8">✦</text>
            <text x="28" y="110" fontSize="10">✦</text>
            <text x="92" y="124" fontSize="10">✦</text>
            {/* Circles */}
            <circle cx="72" cy="18" r="3" fill="#34A853" />
            <circle cx="24" cy="80" r="3" fill="#34A853" />
            <circle cx="118" cy="90" r="3" fill="#34A853" />
            {/* Horizontal decoration lines */}
            <rect x="8" y="68" width="24" height="6" rx="3" fill="#E5E7EB" />
            <rect x="112" y="68" width="24" height="6" rx="3" fill="#E5E7EB" />
            <rect x="0" y="80" width="20" height="6" rx="3" fill="#E5E7EB" opacity="0.6" />
            <rect x="124" y="80" width="20" height="6" rx="3" fill="#E5E7EB" opacity="0.6" />
          </svg>
          {/* Green circle + checkmark */}
          <div className="w-20 h-20 rounded-full bg-[#34A853] flex items-center justify-center z-10 shadow-lg">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M8 18L15 25L28 11"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-[20px] font-bold text-gray-900">
          Role Edit Successful
        </h2>

        <button
          type="button"
          onClick={onDashboard}
          className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors mt-2"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
