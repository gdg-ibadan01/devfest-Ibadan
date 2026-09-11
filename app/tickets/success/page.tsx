'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useOrderByReference } from '@/app/_module/services';
import { showToast } from '@/app/_module/lib/notify';
import {
  SuccessOrderCard,
  SuccessLoadingState,
  SuccessErrorState,
} from './components';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get('paymentReference') ?? searchParams.get('trxref');

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useOrderByReference(reference);

  const handleDownload = () => {
    if (order?.ticket?.url) {
      window.open(order.ticket.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefetch = async () => {
    try {
      const res = await refetch();
      if (res.data?.status === 'PAID') {
        showToast.success('Payment confirmed! Ticket is ready.');
      } else {
        showToast.info('Payment still awaiting confirmation.');
      }
    } catch {
      showToast.error('Failed to check payment status.');
    }
  };

  if (isLoading || isRefetching) {
    return <SuccessLoadingState />;
  }

  if (isError || !order) {
    const message =
      (error as Error | null)?.message ??
      'We could not find your order. Please check the link or contact support.';
    return <SuccessErrorState message={message} reference={reference} />;
  }

  return (
    <SuccessOrderCard
      order={order}
      reference={reference}
      onDownload={handleDownload}
      onRefetch={handleRefetch}
      isRefetching={isRefetching}
    />
  );
}

export default function TicketSuccessPage() {
  return (
    <section
      className="min-h-screen w-full flex md:items-center justify-center pt-[100px] pb-20 md:py-[180px] px-5 relative bg-[#E6F5F9]"
      style={{
        backgroundImage: "url('/ticket_bg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Suspense fallback={<SuccessLoadingState />}>
        <SuccessContent />
      </Suspense>

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
