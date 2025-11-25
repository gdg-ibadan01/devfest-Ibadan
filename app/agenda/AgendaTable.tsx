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
    <div className="overflow-x-auto">
      <table className="w-full border-[2px] border-[#1E1E1E] border-collapse">
        <thead className="bg-white">
          <tr>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-normal text-lg md:text-xl">
              Time
            </th>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-normal text-lg md:text-xl">
              Felicia<br />Gbàjúmò
            </th>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-normal text-lg md:text-xl">
              Banquet<br />Àgọ́
            </th>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-normal text-lg md:text-xl">
              Functions<br />Ètò
            </th>
            <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-normal text-lg md:text-xl">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            const isBanquetEmpty = !item.banquet || item.banquet.trim() === '';
            const isFunctionsEmpty = !item.functions || item.functions.trim() === '';
            const shouldSpan = isBanquetEmpty && isFunctionsEmpty;

            return (
              <tr
                key={idx}
                className={item.highlight ? 'bg-[#F8D8D8]' : 'bg-[#FFF9EA]'}
              >
                <td className="p-3 border-[2px] border-[#1E1E1E] whitespace-nowrap font-normal text-sm md:text-base align-top">
                  {item.time}
                </td>
                <td
                  className="p-3 border-[2px] border-[#1E1E1E] font-normal text-sm md:text-base align-top"
                  colSpan={shouldSpan ? 3 : 1}
                >
                  {item.felicia || ''}
                </td>
                {!shouldSpan && (
                  <>
                    <td className="p-3 border-[2px] border-[#1E1E1E] font-normal text-sm md:text-base align-top">
                      {item.banquet || ''}
                    </td>
                    <td className="p-3 border-[2px] border-[#1E1E1E] font-normal text-sm md:text-base align-top">
                      {item.functions || ''}
                    </td>
                  </>
                )}
                <td className="p-3 border-[2px] border-[#1E1E1E] whitespace-nowrap font-normal text-sm md:text-base align-top">
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
