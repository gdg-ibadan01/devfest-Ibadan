import React from 'react';
import { motion } from 'framer-motion';

interface TicketFormSkeletonProps {
  title?: string;
  isGift?: boolean;
}

export default function TicketFormSkeleton({
  title = 'Buy Ticket',
  isGift = false,
}: Readonly<TicketFormSkeletonProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full flex justify-center z-10"
    >
      <div className="w-full md:max-w-[732px] md:bg-white md:rounded-[20px] md:shadow-lg md:border border-gray-100 overflow-hidden">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 mb-6 md:mb-8 md:bg-[#F0F0F0] md:p-6 border-b md:border-b-0 border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="h-6 w-32 bg-gray-300 rounded-md animate-pulse" />
        </div>

        <div className="w-full px-5 md:px-6 md:pb-8 flex flex-col gap-5">
          {/* Input 1 */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-100 rounded-[8px] border border-gray-200/60 animate-pulse" />
          </div>

          {/* Input 2 */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-100 rounded-[8px] border border-gray-200/60 animate-pulse" />
          </div>

          {/* Additional inputs if gift form */}
          {isGift && (
            <>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-100 rounded-[8px] border border-gray-200/60 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-100 rounded-[8px] border border-gray-200/60 animate-pulse" />
              </div>
            </>
          )}

          {/* Ticket Packages Box Skeleton */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <div className="h-4 w-52 bg-gray-200 rounded animate-pulse" />

            <div className="bg-[#FAF8F5] p-3 md:p-5 rounded-[12px] flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 md:p-4 bg-white rounded-[8px] border border-gray-200 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200" />
                    <div className="h-4 w-24 md:w-32 bg-gray-200 rounded" />
                    <div className="h-5 w-16 md:w-24 bg-gray-100 rounded-full border border-gray-200" />
                  </div>
                  <div className="h-5 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="h-14 w-full bg-gray-200 rounded-[100px] my-2 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
