'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function SuccessLoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full md:max-w-[560px] md:bg-white md:rounded-[24px] md:shadow-xl md:border border-gray-100 overflow-hidden"
    >
      {/* Header Skeleton */}
      <div className="px-6 pt-8 pb-6 md:px-10 md:pt-10 flex flex-col items-center gap-4">
        {/* Circular celebration graphic placeholder */}
        <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-gray-200/70 animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
        </div>

        {/* Title and Status Badge Skeletons */}
        <div className="flex flex-col items-center gap-2.5 w-full mt-2">
          <div className="h-7 w-52 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Details Box Skeleton */}
      <div className="px-6 md:px-10 pb-8">
        <div className="bg-[#FAF8F5] rounded-[16px] px-5 py-3 mb-6 flex flex-col divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-3.5 first:pt-2 last:pb-2"
            >
              <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5 w-full">
                <div className="h-3 w-20 bg-gray-200/70 rounded animate-pulse" />
                <div className="h-4 w-36 bg-gray-300/80 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Note Skeleton */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="h-3.5 w-4/5 bg-gray-200/60 rounded animate-pulse" />
          <div className="h-3.5 w-3/5 bg-gray-200/60 rounded animate-pulse" />
        </div>

        {/* Download Button Skeleton */}
        <div className="h-14 w-full bg-gray-200 rounded-[100px] animate-pulse" />
      </div>
    </motion.div>
  );
}

export function SuccessErrorState({
  message,
  reference,
}: Readonly<{
  message: string;
  reference?: string | null;
}>) {
  return (
    <div className="w-full md:max-w-[560px] md:bg-white md:rounded-[24px] md:shadow-xl md:border border-gray-100 overflow-hidden p-8 md:p-12 flex flex-col items-center gap-5">
      <AlertCircle className="w-14 h-14 text-red-500" />
      <h2 className="text-[20px] font-bold text-[#1E1E1E] text-center">
        Order Not Found
      </h2>
      <p className="text-[#515151] text-[14px] font-sans text-center max-w-[360px] leading-relaxed">
        {message}
      </p>
      {reference && (
        <p className="text-[12px] text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-lg">
          Ref: {reference}
        </p>
      )}
    </div>
  );
}
