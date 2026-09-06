import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import TicketPackageRow, { TicketPackage } from './TicketPackageRow';

interface BuyTicketFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  selectedPackageId: string;
  setSelectedPackageId: (val: string) => void;
  packages: TicketPackage[];
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function BuyTicketForm({
  fullName,
  setFullName,
  email,
  setEmail,
  selectedPackageId,
  setSelectedPackageId,
  packages,
  onSubmit,
  onBack,
}: Readonly<BuyTicketFormProps>) {
  const isFormInvalid = !fullName.trim() || !email.trim() || !selectedPackageId;

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
          Buy Ticket
        </h1>
      </div>

      <div className="w-full md:px-5 md:pb-24">
        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="fullName"
              className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors"
            />
          </div>

          {/* Ticket Packages Section */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium">
              Kindly Select your Ticket Package
            </p>

            <div className="bg-[#FAF8F5] p-3 md:p-5 rounded-[12px] flex flex-col gap-3">
              {packages.map((pkg) => (
                <TicketPackageRow
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={selectedPackageId === pkg.id}
                  onSelect={setSelectedPackageId}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormInvalid}
            className="w-full bg-[#1E1E1E] py-4 text-white hover:bg-core-blue rounded-[100px] flex gap-2 justify-center items-center transition-colors duration-500 font-bold my-2 md:my-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1E1E1E]"
          >
            Proceed to Payment <ArrowUpRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
