import React from 'react';

export interface AgendaRow {
  time: string;
  activity: string;
  isHighlight?: boolean;
}

interface AgendaTableProps {
  title?: string;
  rows: AgendaRow[];
}

export default function AgendaTable({ title, rows }: AgendaTableProps) {
  // Helper to determine if a row should be highlighted (e.g. breaks, networking)
  const shouldHighlight = (row: AgendaRow) => {
    if (row.isHighlight !== undefined) return row.isHighlight;
    const text = row.activity.toLowerCase();
    return (
      text.includes('break') ||
      text.includes('networking') ||
      text.includes('recess') ||
      text.includes('lunch') ||
      text.includes('pictures')
    );
  };

  return (
    <div className="w-full font-sans">
      {title && (
        <h3 className="text-[#583C3C] font-bold text-[16px] md:text-[20px] mb-4 leading-[120%]">
          {title}
        </h3>
      )}
      <div className="w-full overflow-hidden border-[2px] border-[#1E1E1E] shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#FFE7A5] border-b-[2px] border-[#1E1E1E]">
              <th className="w-[50%] md:w-[35%] px-4 py-4 md:px-6 md:py-5 font-bold text-[#1E1E1E] text-[15px] md:text-[18px] select-none">
                Time
              </th>
              <th className="px-4 py-4 md:px-6 md:py-5 font-bold text-[#1E1E1E] text-[15px] md:text-[18px] select-none">
                Activities
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const highlighted = shouldHighlight(row);
              const isLastRow = index === rows.length - 1;
              return (
                <tr
                  key={index}
                  className={`transition-colors duration-200 hover:bg-[#F3F8F4]/40 ${
                    highlighted ? 'bg-[#F8D8D8]' : 'bg-[#FFF9EA]'
                  } ${!isLastRow ? 'border-b-[2px] border-[#1E1E1E]' : ''}`}
                >
                  <td className="px-4 py-4 md:px-6 md:py-5 font-normal md:font-semibold text-[#1E1E1E] text-[14px] md:text-[16px]">
                    {row.time}
                  </td>
                  <td className="px-4 py-4 md:px-6 md:py-5 font-normal md:font-medium text-[#1E1E1E] text-[14px] md:text-[16px]">
                    {row.activity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
