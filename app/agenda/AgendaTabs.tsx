'use client';
import React from 'react';

type Props = {
  activeDay: string;
  setActiveDay: (day: string) => void;
};

export default function AgendaTabs({ activeDay, setActiveDay }: Props) {
  const tabs = [
    {
      id: 'day1',
      mobileLabel: 'Friday (Day 1)',
      desktopLabel: 'Friday, 28th Nov 2025',
    },
    {
      id: 'day2',
      mobileLabel: 'Saturday (Day 2)',
      desktopLabel: 'Saturday, 29th Nov 2025',
    },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-4 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveDay(tab.id)}
          className={`px-4 py-2 md:px-6 md:py-3 rounded-[8px] font-normal text-base md:text-2xl transition-colors ${activeDay === tab.id
            ? 'bg-[#F8D8D8] text-[#583C3C]'
            : 'bg-[#FFFFFF] text-[#B7B7B7] border border-[#D7D7D7]'
            }`}
        >
          <span className="md:hidden">{tab.mobileLabel}</span>
          <span className="hidden md:inline">{tab.desktopLabel}</span>
        </button>
      ))}
    </div>
  );
}
