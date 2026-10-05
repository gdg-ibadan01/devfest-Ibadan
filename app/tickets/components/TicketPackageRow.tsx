import React from 'react';

export interface TicketPackage {
  id: string;
  title: string;
  badge: string;
  price: number;
  formattedPrice: string;
  seatsPerUnit?: number;
}

interface TicketPackageRowProps {
  pkg: TicketPackage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function TicketPackageRow({
  pkg,
  isSelected,
  onSelect,
}: Readonly<TicketPackageRowProps>) {
  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className={`flex items-start md:items-center gap-2 md:gap-4 p-2 md:p-4 bg-white rounded-[8px] border-[2px] transition-all cursor-pointer ${
        isSelected
          ? 'border-[#4285F4]'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Radio Selector */}
      <div className="flex items-center justify-center mt-1 md:mt-0">
        <div
          className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center transition-all ${
            isSelected ? 'border-[#4285F4]' : 'border-gray-300'
          }`}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-y-1.5 md:gap-y-0 select-none">
        <div className="flex items-center gap-[10px] flex-wrap">
          <span className="font-normal md:font-semibold text-gray-800 text-[14px] md:text-[17px] shrink-0">
            {pkg.title}
          </span>
          {pkg.seatsPerUnit && pkg.seatsPerUnit > 1 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
              Group of {pkg.seatsPerUnit}
            </span>
          ) : null}
        </div>
        <span
          className={`font-bold text-[15px] md:text-[17px] shrink-0 ${
            isSelected ? 'text-[#4285F4]' : 'text-gray-800'
          }`}
        >
          {pkg.formattedPrice}
        </span>
      </div>
    </div>
  );
}
