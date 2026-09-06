'use client';

import React from 'react';

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

export default function DetailRow({
  icon,
  label,
  value,
}: Readonly<DetailRowProps>) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0">
      <span className="mt-0.5 text-[#1E1E1E] opacity-50 shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider font-sans">
          {label}
        </span>
        <span className="text-[15px] font-semibold text-[#1E1E1E] break-words font-sans">
          {value}
        </span>
      </div>
    </div>
  );
}
