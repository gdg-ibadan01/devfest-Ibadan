'use client'

import EmptyDiscount from "../../icons/EmptyDiscount";


function EmptyState() {
  return (
    <tr>
      <td colSpan={8} className="py-20">
        <div className="flex flex-col items-center mx-auto justify-center gap-2 border border-[#E6E6E6] rounded-[12px] w-[194px] h-[233px]">
          {/* Simple SVG illustration */}
          <EmptyDiscount />
          <div className="text-center">
            <p className="text-[14px] font-semibold text-gray-700">No Data</p>
            <p className="text-[12px] text-gray-400 mt-1">
              There is no data to
              <br />
              show you right now
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default EmptyState