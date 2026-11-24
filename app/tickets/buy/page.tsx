'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { EVENT_ENDED } from '@/app/_module/config/event-status';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import {
  BuyTicketForm,
  TicketSummary,
  EmptyTicketState,
  TicketFormSkeleton,
  PaymentSuccess,
  TicketStepContainer,
} from '../components';
import {
  useTicketDiscount,
  useTicketPackages,
  useBuyTicketFlow,
} from '../hooks';

function BuyTicketContent() {
  const {
    packages,
    selectedPackageId,
    setSelectedPackageId,
    selectedPackage,
    isLoadingTickets,
    isRefetchingTickets,
    refetchTickets,
  } = useTicketPackages();

  const {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    discountError,
    setDiscountError,
    isDiscountFromUrl,
    isApplyingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
    resetDiscount,
  } = useTicketDiscount();

  const {
    view,
    fullName,
    setFullName,
    email,
    setEmail,
    groupMembers,
    setGroupMembers,
    isGroupTicket,
    reference,
    isGift,
    handleSetIsGift,
    receiverName,
    setReceiverName,
    receiverEmail,
    setReceiverEmail,
    receiverPhone,
    setReceiverPhone,
    isSubmittingOrder,
    handleFormSubmit,
    handlePay,
    handleBack,
    handleResetToForm,
  } = useBuyTicketFlow({
    selectedPackage,
    appliedDiscount,
    onReset: () => {
      resetDiscount();
      if (packages.length > 0) {
        setSelectedPackageId(packages[0].id);
      }
    },
  });

  if (isLoadingTickets) {
    return <TicketFormSkeleton title="Buy Ticket" />;
  }

  if (packages.length === 0) {
    return (
      <EmptyTicketState
        onRetry={() => refetchTickets()}
        isRetrying={isRefetchingTickets}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'form' && (
        <TicketStepContainer stepKey="form">
          <BuyTicketForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            groupMembers={groupMembers}
            setGroupMembers={setGroupMembers}
            isGift={isGift}
            setIsGift={handleSetIsGift}
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            receiverEmail={receiverEmail}
            setReceiverEmail={setReceiverEmail}
            receiverPhone={receiverPhone}
            setReceiverPhone={setReceiverPhone}
            selectedPackageId={selectedPackageId}
            setSelectedPackageId={setSelectedPackageId}
            packages={packages}
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            appliedDiscount={appliedDiscount}
            onApplyDiscount={handleApplyDiscount}
            onRemoveDiscount={handleRemoveDiscount}
            isApplyingDiscount={isApplyingDiscount}
            discountError={discountError}
            setDiscountError={setDiscountError}
            isDiscountFromUrl={isDiscountFromUrl}
          />
        </TicketStepContainer>
      )}

      {view === 'summary' && selectedPackage && (
        <TicketStepContainer stepKey="summary">
          <TicketSummary
            fullName={fullName}
            email={email}
            isGroupTicket={isGroupTicket}
            groupMembers={groupMembers}
            isGift={isGift}
            receiverName={receiverName}
            receiverEmail={receiverEmail}
            receiverPhone={receiverPhone}
            selectedPackage={selectedPackage}
            appliedDiscount={appliedDiscount}
            onBack={handleBack}
            onPay={handlePay}
            isLoading={isSubmittingOrder}
          />
        </TicketStepContainer>
      )}

      {view === 'success' && (
        <TicketStepContainer
          stepKey="success"
          className="w-full flex justify-center z-10 pb-6 md:pb-10"
        >
          <PaymentSuccess
            reference={reference!}
            onReset={handleResetToForm}
            resetButtonLabel="Buy Another Ticket"
          />
        </TicketStepContainer>
      )}
    </AnimatePresence>
  );
}

export default function BuyTicket() {
  const isTablet = useMediaQueryWatcher('(min-width: 768px)');

  return (
    <section
      className="min-h-screen w-full flex md:items-center justify-center pt-[100px] pb-20 md:py-[180px] px-5 relative bg-[#E6F5F9]"
      style={{
        backgroundImage: isTablet
          ? "url('/ticket_bg.png')"
          : "url('/ticket_mobile_bg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {EVENT_ENDED ? (
        <div className="relative z-10 flex h-fit w-full max-w-[520px] flex-col items-center gap-4 rounded-[24px] border border-black bg-white p-8 text-center shadow-sm">
          <h1 className="font-grotesk text-[28px] font-black text-black">
            Ticket sales have closed
          </h1>
          <p className="text-[16px] leading-[1.6] text-[#4B5563]">
            DevFest Ibadan 2026 was a success. Thank you, Ibadan! See you next
            year.
          </p>
          <Link
            href="/"
            className="rounded-[100px] bg-[#18181b] px-8 py-3 text-[15px] font-semibold text-white hover:bg-[#232326]"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <Suspense fallback={<TicketFormSkeleton title="Buy Ticket" />}>
          <BuyTicketContent />
        </Suspense>
      )}

      {/* Decorative footer art */}
      <Image
        src="/ticket_footer_art.svg"
        alt=""
        width={1000}
        height={1000}
        className="w-full left-0 right-0 h-fit absolute bottom-0 pointer-events-none md:block hidden"
      />
    </section>
  );
}
