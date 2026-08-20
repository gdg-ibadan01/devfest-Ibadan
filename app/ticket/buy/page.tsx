'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import {
  TicketPackage,
  BuyTicketForm,
  TicketSummary,
  PaymentSuccess,
} from '../components';

const TICKET_PACKAGES: TicketPackage[] = [
  {
    id: 'friday',
    title: 'Friday',
    badge: 'Workshop',
    price: 4000,
    formattedPrice: '₦ 4,000.00',
  },
  {
    id: 'saturday',
    title: 'Saturday',
    badge: 'Main event',
    price: 8000,
    formattedPrice: '₦ 8,000.00',
  },
  {
    id: 'both-workshop',
    title: 'Friday & Saturday',
    badge: 'Main event & Workshop',
    price: 8000,
    formattedPrice: '₦ 8,000.00',
  },
  {
    id: 'both-main',
    title: 'Friday & Saturday',
    badge: 'Main event',
    price: 8000,
    formattedPrice: '₦ 8,000.00',
  },
];

export default function BuyTicket() {
  const router = useRouter();
  const isTablet = useMediaQueryWatcher('(min-width: 768px)');

  const [view, setView] = useState<'form' | 'summary' | 'success'>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(
    TICKET_PACKAGES[0].id
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedPackage =
    TICKET_PACKAGES.find((p) => p.id === selectedPackageId) ||
    TICKET_PACKAGES[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('summary');
  };

  const handlePay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('success');
    }, 2000);
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
      ticketId: '25A346B',
      package: selectedPackage.title,
      amount: selectedPackage.price.toString(),
      name: fullName,
      email: email,
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
            <BuyTicketForm
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              selectedPackageId={selectedPackageId}
              setSelectedPackageId={setSelectedPackageId}
              packages={TICKET_PACKAGES}
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
            <TicketSummary
              fullName={fullName}
              email={email}
              selectedPackage={selectedPackage}
              onBack={handleBack}
              onPay={handlePay}
              isLoading={isLoading}
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

      {/* Decorative footer art matching the bg background layer */}
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
