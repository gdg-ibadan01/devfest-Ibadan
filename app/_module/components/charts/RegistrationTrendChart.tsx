'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const RegistrationTrendChart = () => {
  const registrationData = [
    { month: 'Jul', registrations: 120 },
    { month: 'Aug', registrations: 145 },
    { month: 'Sep', registrations: 175 },
    { month: 'Oct', registrations: 215 },
    { month: 'Nov', registrations: 240 },
    { month: 'Dec', registrations: 320 },
  ];
  return (
    <div className="mt-4 h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={registrationData}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#DEDEDE" strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#757575',
              fontSize: 15,
              fontWeight: 400,
            }}
            padding={{
              left: 18,
              right: 18,
            }}
            style={{
              fontSize: 12,
            }}
          />
          <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
          <Line
            type="linear"
            dataKey="registrations"
            stroke="#4285F4"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{
              r: 5,
              fill: '#4285F4',
              stroke: '#ffffff',
              strokeWidth: 3,
            }}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegistrationTrendChart;
