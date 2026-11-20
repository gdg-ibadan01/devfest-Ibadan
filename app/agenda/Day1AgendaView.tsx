'use client';

import React, { useState } from 'react';
import {
  day1PlenaryData,
  day1HallOneData,
  day1HallTwoData,
  day1HallThreeData,
  day1HallFourData,
  day1ClosingData,
} from './AgendaData';
import PlenaryTable from './components/PlenaryTable';
import HallOneSection from './components/HallOneSection';
import HallTwoSection from './components/HallTwoSection';
import WorkshopsSection from './components/WorkshopsSection';
import VibeLoungeSection from './components/VibeLoungeSection';
import BreakoutFilterTabs from './components/BreakoutFilterTabs';
import { BreakoutFilter } from './components/agendaConstants';

export default function Day1AgendaView() {
  const [breakoutFilter, setBreakoutFilter] = useState<BreakoutFilter>('all');

  return (
    <div className="w-full space-y-12 pb-12">
      {/* ── Section 1: Morning Plenary ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">
              Main Hall
            </h3>
            <p className="text-xs md:text-sm text-[#555]">
              8:30 AM - 1:30 PM • Keynotes, Founder Panel, Sponsor Showcases
              &amp; Networking
            </p>
          </div>
        </div>

        <PlenaryTable data={day1PlenaryData} />
      </section>

      {/* ── Section 2: Afternoon Breakouts (Halls 1, 2, 3, 4) ── */}
      <section className="space-y-6">
        <div className="bg-[#1E1E1E] text-white p-5 rounded-none border-[2px] border-[#1E1E1E] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold block mb-1">
              PARALLEL TRACKS • 1:30 PM - 5:00 PM
            </span>
            <h3 className="text-2xl md:text-3xl font-bold">
              Breakout Sessions
            </h3>
            <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-2xl">
              Choose your track across 4 active halls: Speaker sessions in Hall 1 &amp; Hall 2, deep-dive workshops in Hall 3, or build and connect at the Vibe Lounge in Hall 4.
            </p>
          </div>

          {/* Filter tabs */}
          <BreakoutFilterTabs
            activeFilter={breakoutFilter}
            onFilterChange={setBreakoutFilter}
          />
        </div>

        {/* Content according to filter: Each hall has its own dedicated card section */}
        <div className="space-y-8">
          {(breakoutFilter === 'all' || breakoutFilter === 'hall-1') && (
            <HallOneSection data={day1HallOneData} />
          )}

          {(breakoutFilter === 'all' || breakoutFilter === 'hall-2') && (
            <HallTwoSection data={day1HallTwoData} />
          )}

          {(breakoutFilter === 'all' || breakoutFilter === 'hall-3') && (
            <WorkshopsSection data={day1HallThreeData} />
          )}

          {(breakoutFilter === 'all' || breakoutFilter === 'hall-4') && (
            <VibeLoungeSection data={day1HallFourData} />
          )}
        </div>
      </section>

      {/* ── Section 3: Closing Programme ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">
              Closing Programme (Main Hall)
            </h3>
            <p className="text-xs md:text-sm text-[#555]">
              5:00 PM - 5:30 PM • Project Showcase, Games, Gifts &amp; Vote of
              Thanks
            </p>
          </div>
        </div>

        <PlenaryTable data={day1ClosingData} />
      </section>
    </div>
  );
}
