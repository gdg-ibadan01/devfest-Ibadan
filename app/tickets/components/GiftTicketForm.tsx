import React from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import TicketPackageRow, { TicketPackage } from './TicketPackageRow';
import type { AppliedDiscount } from '@/app/_module/services/discount.service';

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
  discountCode?: string;
  setDiscountCode?: (val: string) => void;
  appliedDiscount?: AppliedDiscount | null;
  onApplyDiscount?: (code: string) => void;
  onRemoveDiscount?: () => void;
  isApplyingDiscount?: boolean;
  discountError?: string;
  setDiscountError?: (err: string) => void;
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
  discountCode = '',
  setDiscountCode,
  appliedDiscount = null,
  onApplyDiscount,
  onRemoveDiscount,
  isApplyingDiscount = false,
  discountError = '',
  setDiscountError,
}: Readonly<GiftTicketFormProps>) {
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
              Name of Sender{' '}
              <span className="text-gray-400 font-normal">
                (Who is gifting this ticket)
              </span>
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
              Name of Gifted Ticket Receiver{' '}
              <span className="text-gray-400 font-normal">
                (Who is this gifted ticket for)
              </span>
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

          {/* Discount Code Section */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label
              htmlFor="discountCode"
              className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium font-sans flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#515151]" />
                Discount Code
              </span>
              {appliedDiscount && (
                <span className="text-[12px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xl">
                  Applied
                </span>
              )}
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="discountCode"
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode?.(e.target.value.toUpperCase());
                    if (discountError && setDiscountError) setDiscountError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (
                        !appliedDiscount &&
                        discountCode?.trim() &&
                        !isApplyingDiscount &&
                        onApplyDiscount
                      ) {
                        onApplyDiscount(discountCode.trim());
                      }
                    }
                  }}
                  disabled={Boolean(appliedDiscount) || isApplyingDiscount}
                  className={`w-full border rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none transition-colors uppercase disabled:bg-gray-50 disabled:text-gray-600 tracking-wider font-mono text-[14px] ${
                    discountError && !appliedDiscount
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#4285F4]'
                  }`}
                />
                {appliedDiscount && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>

              {appliedDiscount ? (
                <button
                  type="button"
                  onClick={onRemoveDiscount}
                  className="px-4 py-2 text-[13px] md:text-[14px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-[8px] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer font-sans"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    onApplyDiscount &&
                    discountCode?.trim() &&
                    onApplyDiscount(discountCode.trim())
                  }
                  disabled={!discountCode?.trim() || isApplyingDiscount}
                  className="px-5 py-2 text-[14px] md:text-[15px] font-semibold text-white bg-[#1E1E1E] hover:bg-core-blue disabled:bg-gray-300 disabled:cursor-not-allowed rounded-[8px] transition-colors shrink-0 flex items-center gap-2 cursor-pointer disabled:hover:bg-gray-300 font-sans"
                >
                  {isApplyingDiscount ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
              )}
            </div>

            {/* Applied Discount Feedback */}
            {appliedDiscount && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-[8px] px-3.5 py-2 text-emerald-800 text-[13px] md:text-[14px] mt-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Discount applied:{' '}
                    <strong className="font-bold">
                      ₦
                      {appliedDiscount.amount.toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      off
                    </strong>
                  </span>
                </div>
                <span className="font-mono text-[11px] md:text-[12px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {appliedDiscount.code}
                </span>
              </div>
            )}

            {/* Error Message (displayed in red on the UI) */}
            {discountError && !appliedDiscount && (
              <div className="flex items-center gap-1.5 text-red-600 text-[13px] md:text-[14px] font-medium mt-1 font-sans">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-red-600 font-medium">
                  {discountError}
                </span>
              </div>
            )}
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
