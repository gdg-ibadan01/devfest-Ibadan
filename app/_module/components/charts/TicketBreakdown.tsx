'use client'

import React from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';
import type { TicketBreakdownSliceDto } from '@/app/_module/api/types';

const SLICE_COLORS = ['#4285F4', '#34A853', '#F9AB00', '#EA4335', '#9AA0A6', '#AB47BC'];

interface TicketBreakdownProps {
  data: TicketBreakdownSliceDto[];
}

const TicketBreakdown = ({ data }: TicketBreakdownProps) => {
  const ticketBreakdown = (data ?? []).map((slice, index) => ({
    label: slice.ticketName,
    value: slice.percentage,
    color: SLICE_COLORS[index % SLICE_COLORS.length],
  }));

  if (ticketBreakdown.length === 0) {
    return (
      <div className="mt-8 flex h-[150px] items-center justify-center">
        <p className="text-[13px] text-gray-400">No ticket sales yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center lg:gap-10">
      <div className="h-[150px] w-[150px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ticketBreakdown}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={75}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              stroke="none"
              isAnimationActive={false}
            >
              {ticketBreakdown.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="space-y-3 pt-4">
        {ticketBreakdown.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-[15px]">
            <span
              className="h-[12px] w-[12px] shrink-0 rounded-[3px]"
              style={{
                backgroundColor: item.color,
              }}
            />

            <span className="text-[13px] text-[#303030]">
              {item.label} <strong>({item.value}%)</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketBreakdown;
