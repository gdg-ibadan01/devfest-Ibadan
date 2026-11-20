import React from 'react';

type Props = {
  label: string;
  /** Total number of columns the header cell should span. Defaults to 6. */
  colSpan?: number;
};

export default function SectionHeader({ label, colSpan = 6 }: Readonly<Props>) {
  return (
    <tr className="bg-[#1E1E1E] text-white">
      <td
        colSpan={colSpan}
        className="px-4 py-2 text-sm font-semibold tracking-wide border-[2px] border-[#1E1E1E]"
      >
        {label}
      </td>
    </tr>
  );
}
