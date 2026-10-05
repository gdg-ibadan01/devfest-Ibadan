import { Gift } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface GiftRecipientFieldsProps {
  isGift: boolean;
  setIsGift: (val: boolean) => void;
  receiverName: string;
  setReceiverName: (val: string) => void;
  receiverEmail: string;
  setReceiverEmail: (val: string) => void;
  receiverPhone: string;
  setReceiverPhone: (val: string) => void;
}

export default function GiftRecipientFields({
  isGift,
  setIsGift,
  receiverName,
  setReceiverName,
  receiverEmail,
  setReceiverEmail,
  receiverPhone,
  setReceiverPhone,
}: Readonly<GiftRecipientFieldsProps>) {
  return (
    <>
      <label
        htmlFor="isGift"
        className="flex items-center gap-3 cursor-pointer select-none group w-fit"
      >
        <div className="relative w-5 h-5 shrink-0">
          <input
            id="isGift"
            type="checkbox"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
            className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-5 h-5 rounded-[5px] border-2 border-gray-300 group-hover:border-[#4285F4] peer-checked:bg-[#1E1E1E] peer-checked:border-[#1E1E1E] transition-all flex items-center justify-center">
            {isGift && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-[14px] md:text-[15px] text-[#1E1E1E] font-medium flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-[#515151]" />
          I&apos;m buying this for someone else
        </span>
      </label>

      {/* Gift Recipient Fields */}
      <AnimatePresence initial={false}>
        {isGift && (
          <motion.div
            key="gift-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 border border-dashed border-gray-300 rounded-[12px] p-4 bg-gray-50/60">
              <p className="text-[13px] text-gray-500 font-medium -mb-1">
                Recipient&apos;s Details
              </p>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="receiverName"
                  className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium"
                >
                  Recipient&apos;s Full Name
                </label>
                <input
                  type="text"
                  id="receiverName"
                  placeholder="Enter Full Name"
                  required={isGift}
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="receiverEmail"
                  className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium"
                >
                  Recipient&apos;s Email Address
                </label>
                <input
                  type="email"
                  id="receiverEmail"
                  placeholder="Enter Email Address"
                  required={isGift}
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="receiverPhone"
                  className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium"
                >
                  Recipient&apos;s Phone Number
                </label>
                <input
                  type="tel"
                  id="receiverPhone"
                  placeholder="Enter Phone Number"
                  required={isGift}
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors bg-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
