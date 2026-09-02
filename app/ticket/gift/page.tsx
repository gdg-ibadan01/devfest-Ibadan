'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import { useCreateOrder, useTicketsOnSale } from '@/app/_module/services';
import type { CreateOrderResponseDto } from '@/app/_module/api/types';
import {
  TicketPackage,
  GiftTicketForm,
  GiftTicketSummary,
  PaymentSuccess,
  EmptyTicketState,
  TicketFormSkeleton,
} from '../components';

export default function GiftTicket() {
  const router = useRouter();
  const isTablet = useMediaQueryWatcher('(min-width: 768px)');

  const {
    data: onSaleData,
    isLoading: isLoadingTickets,
    isRefetching: isRefetchingTickets,
    refetch: refetchTickets,
  } = useTicketsOnSale();

  const packages: TicketPackage[] = (onSaleData?.data || []).map((ticket) => {
    const rawPrice = parseFloat(ticket.price) || 0;
    const rawDiscount = parseFloat(ticket.discount || '0') || 0;
    const finalPrice = Math.max(0, rawPrice - rawDiscount);
    return {
      id: ticket.slug,
      title: ticket.name,
      badge: ticket.description || 'Access Pass',
      price: finalPrice,
      formattedPrice: `₦ ${finalPrice.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    };
  });

  const [view, setView] = useState<'form' | 'summary' | 'success'>('form');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [orderData, setOrderData] = useState<CreateOrderResponseDto | null>(null);

  const { mutate: createOrder, isPending } = useCreateOrder();

  // Sync selected package ID when tickets load
  useEffect(() => {
    if (packages.length > 0) {
      if (!selectedPackageId || !packages.some((p) => p.id === selectedPackageId)) {
        setSelectedPackageId(packages[0].id);
      }
    }
  }, [packages, selectedPackageId]);

  const selectedPackage =
    packages.find((p) => p.id === selectedPackageId) || packages[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('summary');
  };

  const handlePay = () => {
    createOrder(
      {
        slug: selectedPackage.id,
        attendee: {
          fullName: receiverName.trim(),
          email: receiverEmail.trim(),
          phoneNumber: receiverPhone.trim() || undefined,
        },
        gifter: senderName.trim()
          ? {
              fullName: senderName.trim(),
              email: receiverEmail.trim(),
            }
          : undefined,
      },
      {
        onSuccess: (data) => {
          setOrderData(data);
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            setView('success');
          }
        },
      }
    );
  };

  const handleBack = () => {
    if (view === 'summary') {
      setView('form');
    } else {
      router.back();
    }
  };

  const handleDownload = () => {
    const params = new URLSearchParams({
      ticketId: orderData?.reference || '25A346B',
      package: selectedPackage.title,
      amount: selectedPackage.price.toString(),
      name: receiverName,
      email: receiverEmail,
    });
    router.push(`/ticket/preview?${params.toString()}`);
  };

  return (
    <section
      className="min-h-screen w-full flex md:items-center justify-center pt-[100px] md:py-[180px] px-5 relative bg-[#E6F5F9]"
      style={{
        backgroundImage: isTablet
          ? "url('/ticket_bg.png')"
          : "url('/ticket_mobile_bg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {isLoadingTickets ? (
        <TicketFormSkeleton isGift title="Gift Ticket" />
      ) : packages.length === 0 ? (
        <EmptyTicketState
          onRetry={() => refetchTickets()}
          isRetrying={isRefetchingTickets}
        />
      ) : (
        <AnimatePresence mode="wait">
          {view === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full flex justify-center z-10"
            >
              <GiftTicketForm
                senderName={senderName}
                setSenderName={setSenderName}
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
              />
            </motion.div>
          )}

          {view === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full flex justify-center z-10"
            >
              <GiftTicketSummary
                senderName={senderName}
                receiverName={receiverName}
                receiverEmail={receiverEmail}
                receiverPhone={receiverPhone}
                selectedPackage={selectedPackage}
                onBack={handleBack}
                onPay={handlePay}
                isLoading={isPending}
              />
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full flex justify-center z-10"
            >
              <PaymentSuccess onDownload={handleDownload} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

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
