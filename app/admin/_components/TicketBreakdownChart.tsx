'use client';

import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Early Bird', value: 45, color: '#4285F4' },
  { name: 'Regular', value: 35, color: '#34A853' },
  { name: 'VIP', value: 15, color: '#FBBC04' },
  { name: 'Student', value: 5, color: '#EA4335' },
];

export default function TicketBreakdownChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-7 pt-5 pb-6 h-full">
      <h3 className="text-[14px] font-semibold text-black mb-4">
        Ticket Breakdown
      </h3>
      <div className="flex items-center gap-5">
        {/* Donut Chart */}
        <div className="flex-shrink-0">
          <PieChart width={150} height={150}>
            <Pie
              data={data}
              cx={70}
              cy={70}
              innerRadius={44}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '11px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
              formatter={(value) => [`${value}%`, '']}
            />
          </PieChart>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-[9px]">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-[10px] h-[10px] rounded-[2px] flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-gray-700 whitespace-nowrap">
                {item.name}{' '}
                <span className="font-semibold">({item.value}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
