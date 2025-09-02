import React from 'react';
import { AgendaItem } from './AgendaData';

type Props = {
  data: AgendaItem[];
};

export default function AgendaTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
        <p className="text-lg font-medium">📅 No agenda available yet</p>
        <p className="text-sm">Stay tuned for updates.</p>
      </div>
    );
  }

  return (
    <table className="w-full border-[2px] border-[#1E1E1E] border-collapse">
      <thead className="bg-[#FFE7A5]">
        <tr>
          <th className="p-3 text-left border-b-[2px] border-[#1E1E1E] whitespace-nowrap font-medium text- mbased:text-xl">
            Time
          </th>
          <th className="p-3 text-right md:text-left border-b-[2px] border-[#1E1E1E] font-medium text-base md:text-xl">
            Activities
          </th>
          <th className="p-3 text-left border-b-[2px] border-[#1E1E1E] whitespace-nowrap font-medium text-base md:text-xl hidden md:table-cell">
            Duration
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr
            key={idx}
            className={item.highlight ? 'bg-[#F8D8D8]' : 'bg-[#FFF9EA]'}
          >
            <td className="p-3 border-b-[2px] border-[#1E1E1E] whitespace-nowrap font-normal md:font-medium text-sm md:text-base">
              {item.time}
            </td>
            <td className="p-3 border-b-[2px] border-[#1E1E1E] text-right md:text-left font-normal md:font-medium text-sm md:text-base">
              {item.activity}
            </td>
            <td className="p-3 border-b-[2px] border-[#1E1E1E] whitespace-nowrap font-normal md:font-medium text-sm md:text-base hidden md:table-cell">
              {item.duration}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
