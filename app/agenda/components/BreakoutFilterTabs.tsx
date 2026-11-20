import React from 'react';
import { BreakoutFilter, BREAKOUT_FILTER_OPTIONS } from './agendaConstants';

type Props = {
  activeFilter: BreakoutFilter;
  onFilterChange: (filter: BreakoutFilter) => void;
};

export default function BreakoutFilterTabs({
  activeFilter,
  onFilterChange,
}: Readonly<Props>) {
  return (
    <div className="flex flex-wrap gap-2 self-start md:self-center">
      {BREAKOUT_FILTER_OPTIONS.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border ${
              isActive
                ? tab.activeColor
                : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
