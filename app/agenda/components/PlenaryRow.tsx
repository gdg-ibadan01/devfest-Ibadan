import React from 'react';
import { AgendaItem } from '../AgendaData';

type Props = {
  item: AgendaItem;
};

export default function PlenaryRow({ item }: Readonly<Props>) {
  const isBreak = item.type === 'break';
  const rowBg = item.highlight
    ? 'bg-[#F8D8D8]'
    : isBreak
      ? 'bg-[#FFF9EA]'
      : 'bg-white';

  return (
    <tr className={rowBg}>
      <td className="p-3 border-[2px] border-[#1E1E1E] whitespace-nowrap font-medium text-sm align-top w-[130px]">
        {item.time}
      </td>

      {/* spans all 4 hall columns */}
      <td
        className="p-3 border-[2px] border-[#1E1E1E] text-sm font-medium text-[#1E1E1E] align-top"
        colSpan={4}
      >
        <span>{item.schedule}</span>

        {item.speaker && (
          <span className="block text-xs text-[#555] mt-0.5 font-normal">
            {item.speaker}
          </span>
        )}

        {item.notes && (
          <span className="block text-xs text-[#888] mt-0.5 font-normal italic">
            {item.notes}
          </span>
        )}

        {item.room && (
          <span className="block text-xs mt-1 font-normal">
            <span className="bg-[#1E1E1E] text-white rounded px-1.5 py-0.5">
              {item.room}
            </span>
          </span>
        )}
      </td>

      <td className="p-3 border-[2px] border-[#1E1E1E] whitespace-nowrap text-sm align-top">
        {item.duration}
      </td>
    </tr>
  );
}
