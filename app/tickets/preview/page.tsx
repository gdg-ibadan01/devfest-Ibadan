'use client';

import React, { Suspense } from 'react';
import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { formatAmount } from '@/utils/formatAmount';

function TicketPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTablet = useMediaQueryWatcher('(min-width: 768px)');

  const name = searchParams.get('name') || 'Attendee';
  const email = searchParams.get('email') || '';
  const ticketId = searchParams.get('ticketId') || '25A346B';
  const paymentDay = searchParams.get('package') || 'Friday';
  const amountParam = searchParams.get('amount') || '4000';
  const amount = Number(amountParam);

  const qrValue = `https://devfestibadan.com/ticket/verify?id=${ticketId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

  return (
    <section
      className="min-h-screen w-full flex md:items-center justify-center pt-[100px] md:py-[180px] px-5 relative bg-[#E6F5F9]"
      style={{
        backgroundImage: isTablet
          ? "url('/ticket_bg_preview.png')"
          : "url('/ticket_mobile_bg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="w-full md:max-w-[684px] md:bg-white md:rounded-[20px] md:shadow-[0_12px_24px_0px_#1158CB0D] md:border border-gray-100 overflow-hidden z-10">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 select-none">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-full h-full text-[#515151]" />
          </button>
          <h1 className="text-[20px] font-bold text-[#1E1E1E] font-sans">
            Ticket
          </h1>
        </div>

        {/* Card Body */}
        <div className="p-5 md:p-6 flex flex-col gap-5">
          {/* Header Decorator */}
          <div className="w-full bg-[#F5F8FF] border border-[#E2E8F0] rounded-[12px] py-4 flex justify-center items-center overflow-hidden">
            <Image
              src="/ticket_decorator.svg"
              alt=""
              width={500}
              height={100}
              className="w-[90%] h-auto object-contain select-none pointer-events-none"
            />
          </div>

          {/* DEVFEST Ibadan Banner */}
          <div className="w-full bg-[#EFF6FF] border border-dashed border-[#BFDBFE] rounded-[8px] px-6 py-4 flex justify-between items-center select-none font-sans">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[#1D4ED8] text-[18px] md:text-[22px]">
                DEVFEST
              </span>
              <span className="text-[#3B82F6] text-[12px] md:text-[14px] font-normal">
                Ibadan
              </span>
            </div>
            <span className="font-bold text-[#1D4ED8] text-[18px] md:text-[22px]">
              2025
            </span>
          </div>

          {/* Details Table - Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-4 p-5 border border-gray-200 rounded-[12px] font-sans">
            <div className="flex flex-col gap-1.5">
              <span className="text-gray-400 text-[12px] font-medium uppercase tracking-wider">
                Ticket ID
              </span>
              <span className="text-[#1E1E1E] font-bold text-[16px]">
                {ticketId}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-gray-400 text-[12px] font-medium uppercase tracking-wider">
                Payment Day
              </span>
              <span className="text-[#1E1E1E] font-bold text-[16px]">
                {paymentDay}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-right">
              <span className="text-gray-400 text-[12px] font-medium uppercase tracking-wider">
                Amount
              </span>
              <span className="text-[#1E1E1E] font-bold text-[16px]">
                {formatAmount(amount)}
              </span>
            </div>
          </div>

          {/* Details Table - Mobile */}
          <div className="flex md:hidden flex-col gap-3.5 p-4 border border-gray-200 rounded-[12px] font-sans text-[14px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-normal">Ticket ID</span>
              <span className="text-[#1E1E1E] font-bold">{ticketId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-normal">Payment Day</span>
              <span className="text-[#1E1E1E] font-bold">{paymentDay}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-normal">Amount</span>
              <span className="text-[#1E1E1E] font-bold">
                {formatAmount(amount)}
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-[#FAF8F5] py-8 px-6 rounded-[12px] flex justify-center items-center select-none">
            <div className="bg-white p-4 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-center">
              <QRCode
                value={qrValue}
                size={160}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox="0 0 160 160"
              />
            </div>
          </div>
          <button
            type="button"
            className="w-full bg-[#1E1E1E] py-4 text-white hover:bg-core-blue rounded-[100px] flex gap-2 justify-center items-center transition-colors duration-500 font-bold my-2 md:my-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1E1E1E]"
          >
            Download Ticket
          </button>
        </div>
      </div>

      {/* Decorative footer art matching the bg background layer */}
      <Image
        src="/ticket_footer_art.svg"
        alt=""
        width={1000}
        height={1000}
        className="w-full left-0 right-0 h-fit absolute bottom-0 pointer-events-none md:block hidden z-0"
      />
    </section>
  );
}

export default function TicketPreview() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#E6F5F9]">
          <div className="w-8 h-8 border-4 border-core-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TicketPreviewContent />
    </Suspense>
  );
}
