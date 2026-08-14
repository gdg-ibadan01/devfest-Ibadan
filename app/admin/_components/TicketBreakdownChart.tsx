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
    <div className="bg-white border border-gray-200 rounded-2xl px-6 pt-6 pb-4 h-full">
      <h3 className="text-[15px] font-semibold text-black mb-5">
        Ticket Breakdown
      </h3>
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="flex-shrink-0">
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              cx={75}
              cy={75}
              innerRadius={48}
              outerRadius={75}
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
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
              formatter={(value) => [`${value}%`, '']}
            />
          </PieChart>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-[10px]">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-[12px] h-[12px] rounded-[3px] flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[13px] text-gray-700 whitespace-nowrap">
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
