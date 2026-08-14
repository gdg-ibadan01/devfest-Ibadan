'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jul', registrations: 80 },
  { month: 'Aug', registrations: 130 },
  { month: 'Sep', registrations: 175 },
  { month: 'Oct', registrations: 265 },
  { month: 'Nov', registrations: 370 },
  { month: 'Dec', registrations: 455 },
];

export default function RegistrationTrendChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 pt-6 pb-4 h-full">
      <h3 className="text-[15px] font-semibold text-black mb-5">
        Registration Trend
      </h3>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 12, left: -24, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray=""
            vertical={false}
            stroke="#F0F0F0"
            strokeWidth={1}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 600 }}
            itemStyle={{ color: '#4285F4' }}
          />
          <Line
            type="monotone"
            dataKey="registrations"
            stroke="#4285F4"
            strokeWidth={2.5}
            dot={{ r: 4.5, fill: '#4285F4', strokeWidth: 0 }}
            activeDot={{ r: 6.5, fill: '#4285F4', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
