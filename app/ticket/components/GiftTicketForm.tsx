import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import TicketPackageRow, { TicketPackage } from './TicketPackageRow';

interface GiftTicketFormProps {
  senderName: string;
  setSenderName: (val: string) => void;
  receiverName: string;
  setReceiverName: (val: string) => void;
  receiverEmail: string;
  setReceiverEmail: (val: string) => void;
  receiverPhone: string;
  setReceiverPhone: (val: string) => void;
  selectedPackageId: string;
  setSelectedPackageId: (val: string) => void;
  packages: TicketPackage[];
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function GiftTicketForm({
  senderName,
  setSenderName,
  receiverName,
  setReceiverName,
  receiverEmail,
  setReceiverEmail,
  receiverPhone,
  setReceiverPhone,
  selectedPackageId,
  setSelectedPackageId,
  packages,
  onSubmit,
  onBack,
}: GiftTicketFormProps) {
  const isFormInvalid =
    !senderName.trim() ||
    !receiverName.trim() ||
    !receiverEmail.trim() ||
    !receiverPhone.trim() ||
    !selectedPackageId;

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
        <h1 className="text-20 md:text-24 font-bold text-[#515151] font-sans">
          Gift Ticket
        </h1>
      </div>

      <div className="w-full md:px-5 md:pb-24">
        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {/* Sender Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="senderName"
              className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium font-sans"
            >
              Name of Sender <span className="text-gray-400 font-normal">(Who is gifting this ticket)</span>
            </label>
            <input
              type="text"
              id="senderName"
              placeholder="Enter Full Name"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors font-sans"
            />
          </div>

          {/* Receiver Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="receiverName"
              className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium font-sans"
            >
              Name of Gifted Ticket Receiver <span className="text-gray-400 font-normal">(Who is this gifted ticket for)</span>
            </label>
            <input
              type="text"
              id="receiverName"
              placeholder="Enter Full Name"
              required
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors font-sans"
            />
          </div>

          {/* Receiver Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="receiverEmail"
              className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium font-sans"
            >
              Receiver&apos;s Email Address
            </label>
            <input
              type="email"
              id="receiverEmail"
              placeholder="Enter Email Address"
              required
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors font-sans"
            />
          </div>

          {/* Receiver Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="receiverPhone"
              className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium font-sans"
            >
              Receiver&apos;s Phone Number
            </label>
            <input
              type="tel"
              id="receiverPhone"
              placeholder="Enter Phone Number"
              required
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors font-sans"
            />
          </div>

          {/* Ticket Packages Section */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium font-sans">
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
