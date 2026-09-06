import { motion } from 'framer-motion';
import Image from 'next/image';

interface PaymentSuccessProps {
  onDownload: () => void;
}

export default function PaymentSuccess({
  onDownload,
}: Readonly<PaymentSuccessProps>) {
  return (
    <div className="w-full md:max-w-[732px] md:bg-white md:rounded-[20px] md:shadow-lg md:border border-gray-100 overflow-hidden">
      <div className="w-full px-5 pb-8 md:pb-24 flex flex-col items-center">
        {/* Animated Celebration Icon */}
        <motion.div
          initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="w-full flex justify-center mb-6"
        >
          <Image
            src="/success.png"
            alt="Payment Successful"
            width={240}
            height={240}
            className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] object-contain select-none pointer-events-none"
          />
        </motion.div>

        {/* Text Content */}
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#1E1E1E] text-center mb-3">
          Payment Successful
        </h2>

        <p className="text-[#515151] text-[14px] md:text-[16px] leading-[150%] text-center max-w-[420px] mb-8 font-sans">
          The payment for Devfest 2026 is successful, You will be required to
          show it at the registration stand.
        </p>

        {/* Download Ticket Button */}
        <button
          type="button"
          onClick={onDownload}
          className="w-full bg-[#1E1E1E] hover:bg-core-blue text-white py-4 rounded-[100px] font-bold transition-all text-center flex justify-center items-center cursor-pointer focus:outline-none text-[15px] md:text-[16px] font-sans shadow-md hover:shadow-lg"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
}
