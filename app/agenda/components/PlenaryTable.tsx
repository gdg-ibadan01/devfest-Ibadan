import React from 'react';
import { AgendaItem } from '../AgendaData';

type Props = {
  data: AgendaItem[];
  title?: string;
};

export default function PlenaryTable({ data, title }: Readonly<Props>) {
  return (
    <div className="overflow-x-auto w-full">
      {title && (
        <div className="bg-[#1E1E1E] text-white px-4 py-2.5 font-semibold text-sm md:text-base border-x-[2px] border-t-[2px] border-[#1E1E1E] flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs font-normal text-gray-300">
            Main Hall / All Halls
          </span>
        </div>
      )}
      <table className="w-full border-[2px] border-[#1E1E1E] border-collapse min-w-[500px]">
        <thead className="bg-white">
          <tr>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-semibold text-sm md:text-base w-[140px] md:w-[180px]">
              Time
            </th>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-semibold text-sm md:text-base">
              Programme & Details
            </th>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-semibold text-sm md:text-base w-[90px] md:w-[110px]">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            const isBreak = item.type === 'break';
            const rowBg = item.highlight
              ? 'bg-[#F8D8D8]'
              : isBreak
                ? 'bg-[#FFF9EA]'
                : 'bg-white';

            return (
              <tr key={i} className={rowBg}>
                <td className="p-3.5 border-[2px] border-[#1E1E1E] whitespace-nowrap font-medium text-xs md:text-sm align-top">
                  {item.time}
                </td>
                <td className="p-3.5 border-[2px] border-[#1E1E1E] text-xs md:text-sm font-medium text-[#1E1E1E] align-top">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                        {item.schedule}
                      </span>
                      {item.room && (
                        <span className="inline-block text-[11px] font-medium bg-[#1E1E1E] text-white px-2 py-0.5 rounded">
                          {item.room}
                        </span>
                      )}
                    </div>

                    {item.speaker && (
                      <p className="text-xs md:text-sm text-[#444] font-normal">
                        🎤 {item.speaker}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-xs text-[#777] italic font-normal">
                        💡 {item.notes}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-3.5 border-[2px] border-[#1E1E1E] whitespace-nowrap text-xs md:text-sm align-top font-medium">
                  {item.duration}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
