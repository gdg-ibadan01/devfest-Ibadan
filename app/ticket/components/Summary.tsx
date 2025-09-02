import { useAttendeeRegistration } from '@/hooks/useAttendeeRegistration';
import { formatAmount } from '@/utils/formatAmount';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import React from 'react';

interface SummaryProps {
  setView: React.Dispatch<React.SetStateAction<string>>;

  formData: {
    fullName: string;
    phoneNumber: string;
    jobTitle: string;
    email: string;
    company?: string
  };
}

const Summary: React.FC<SummaryProps> = ({ setView, formData }) => {
  const { registerAttendeeWithPayment, isLoading } = useAttendeeRegistration();
  const amount = 4000 + 150;
  const handlePayNow = async () => {
    try {
      await registerAttendeeWithPayment({ ...formData, company: 'Paystack' }, amount);

    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="bg-white px-4 md:px-28 py-48 rounded-2xl flex flex-col gap-10 border md:border-none">
      <button
        type='button'
        className="w-fit flex flex-col md:flex-row justify-center items-start mdl:items-center gap-3 text-gray-600"
        onClick={() => setView('checkout')}
      >
        <ArrowLeft />
        <p className="font-bold text-xl md:text-2xl">Summary</p>
      </button>
      <div className="flex flex-col gap-6">
        <div className="bg-gray-100 border border-gray-200 rounded-md p-5 flex flex-col gap-3">
          <p className="flex justify-between items-center gap-5 md:gap-0">
            <span className="text-gray-400 font-thin text-sm md:text-base">
              Ticket Price
            </span>
            <span className="text-gray-500 font-bold">
              {formatAmount(amount)}
            </span>
          </p>
          <p className="flex justify-between items-center gap-5 md:gap-0">
            <span className="text-gray-400 font-thin text-sm md:text-base">
              Date paid for
            </span>
            <span className="text-gray-500 font-bold">
              {new Date('2025-11-29').toDateString()}
            </span>
          </p>
          <p className="flex justify-between items-center gap-5 md:gap-0">
            <span className="text-gray-400 font-thin text-sm md:text-base">
              VAT
            </span>
            <span className="text-gray-500 font-bold">{formatAmount(150)}</span>
          </p>
        </div>
        <p className="flex justify-between items-center bg-pastel-blue rounded-md p-5 ">
          <span className="text-[#2D879D] font-thin">Total Amount</span>
          <span className="text-[#0B5A6E] font-bold text-xl">
            {formatAmount(amount)}
          </span>
        </p>
        <button
          type='button'
          disabled={isLoading}
          className="bg-[#1E1E1E] py-4 text-white hover:bg-core-blue rounded-[100px] flex gap-2 justify-center transition-colors duration-500"
          onClick={handlePayNow}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            <>   Pay Now <ArrowUpRight /></>
          )}

        </button>
      </div>
    </div>
  );
};

export default Summary;
