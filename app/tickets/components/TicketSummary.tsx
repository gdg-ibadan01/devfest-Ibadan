import { formatAmount } from '@/utils/formatAmount';
import { ArrowLeft } from 'lucide-react';
import { TicketPackage } from './TicketPackageRow';

interface TicketSummaryProps {
  fullName: string;
  email: string;
  selectedPackage: TicketPackage;
  onBack: () => void;
  onPay: () => void;
  isLoading: boolean;
}

export default function TicketSummary({
  fullName,
  email,
  selectedPackage,
  onBack,
  onPay,
  isLoading,
}: Readonly<TicketSummaryProps>) {
  const vat = 50;
  const total = selectedPackage.price + vat;

  return (
    <div className="w-full md:max-w-[732px] md:bg-white md:rounded-[20px] md:shadow-lg md:border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8 md:bg-[#F0F0F0] md:p-24">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-24 h-24 rounded-full hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-full h-full text-[#515151]" />
        </button>
        <h1 className="text-20 md:text-24 font-bold text-[#515151]">
          Ticket Summary
        </h1>
      </div>

      <div className="w-full md:px-5 md:pb-24 flex flex-col gap-6">
        {/* Package Details Box */}
        <div className="bg-[#FAF8F5] p-5 rounded-[12px] flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#515151] text-[14px] md:text-[16px] select-none">
            <span className="font-normal text-gray-500 font-sans">
              Selected Package Price
            </span>
            <span className="font-bold text-[#1E1E1E]">
              {formatAmount(selectedPackage.price)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#515151] text-[14px] md:text-[16px] select-none">
            <span className="font-normal text-gray-500 font-sans">
              Date paid for
            </span>
            <span className="font-bold text-[#1E1E1E]">
              {selectedPackage.title}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#515151] text-[14px] md:text-[16px] select-none">
            <span className="font-normal text-gray-500 font-sans">Charges</span>
            <span className="font-bold text-[#1E1E1E]">
              {formatAmount(vat)}
            </span>
          </div>
        </div>

        {/* Total Amount Box */}
        <div className="flex justify-between items-center bg-[#F0F4FF] border border-[#D0E0FF] rounded-[8px] p-4 md:p-5 select-none">
          <span className="text-[#1D4ED8] font-medium text-[15px] md:text-[17px] font-sans">
            Total Amount
          </span>
          <span className="text-[#1D4ED8] font-bold text-[18px] md:text-[22px]">
            {formatAmount(total)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row md:justify-end gap-4 mt-2">
          <button
            type="button"
            onClick={onPay}
            disabled={isLoading}
            className="w-full md:w-fit bg-[#1E1E1E] hover:bg-core-blue disabled:bg-gray-400 text-white py-[15px] px-[34px] rounded-[100px] font-bold transition-all text-center flex justify-center items-center cursor-pointer focus:outline-none text-[15px] md:text-[16px] disabled:cursor-not-allowed font-sans"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Pay Ticket'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
