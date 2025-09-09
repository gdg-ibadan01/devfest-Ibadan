'use client';
import React from 'react';

type Props = {
  activeDay: string;
  setActiveDay: (day: string) => void;
};

export default function AgendaTabs({ activeDay, setActiveDay }: Props) {
  return (
    <div className="flex justify-between md:justify-normal gap-4 mb-6">
      <button
        onClick={() => setActiveDay('day1')}
        className={`px-2 py-1 md:px-3 md:py-2 rounded-[8px] font-normal text-[14px] md:text-2xl whitespace-nowrap ${
          activeDay === 'day1'
            ? 'bg-[#F8D8D8] text-[#583C3C]'
            : 'bg-[#FFFFFF] text-[#B7B7B7] border border-[#D7D7D7]'
        }`}
      >
        Friday, 3rd Dec 2024
      </button>
      <button
        onClick={() => setActiveDay('day2')}
        className={`px-2 py-1 md:px-3 md:py-2 rounded-[8px] font-normal text-[14px] md:text-2xl whitespace-nowrap ${
          activeDay === 'day2'
            ? 'bg-[#F8D8D8] text-[#583C3C]'
            : 'bg-[#FFFFFF] text-[#B7B7B7] border border-[#D7D7D7]'
        }`}
      >
        Saturday, 4th Dec 2024
      </button>
    </div>
  );
}
