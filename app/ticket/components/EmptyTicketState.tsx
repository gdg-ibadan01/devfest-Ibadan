import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TicketX, RefreshCw, ArrowLeft } from 'lucide-react';

interface EmptyTicketStateProps {
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function EmptyTicketState({
  onRetry,
  isRetrying = false,
}: Readonly<EmptyTicketStateProps>) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full md:max-w-[620px] bg-white rounded-[24px] shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden z-10 p-6 md:p-10 flex flex-col items-center text-center"
    >
      {/* Icon Badge */}
      <div className="relative mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center">
          <TicketX
            className="w-10 h-10 md:w-12 md:h-12 text-[#2563EB]"
            strokeWidth={1.75}
          />
        </div>
        <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] uppercase tracking-wide">
          Closed
        </span>
      </div>

      {/* Headline & Description */}
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#1E1E1E] mb-3 font-sans">
        No Tickets Currently on Sale
      </h2>
      <p className="text-[#515151] text-[14px] md:text-[16px] leading-relaxed max-w-[440px] mb-8 font-sans">
        Ticket sales for DevFest Ibadan are either not open yet or all currently
        available batches have concluded. Please stay connected for upcoming
        sales announcements.
      </p>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-[100px] border border-gray-200 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-white font-semibold text-[14px] md:text-[15px] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Home
        </button>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto px-6 py-3.5 rounded-[100px] bg-[#1E1E1E] hover:bg-core-blue text-white font-semibold text-[14px] md:text-[15px] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
            />
            {isRetrying ? 'Checking...' : 'Check Again'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
