'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import {
  useCreateOrder,
  useTicketsOnSale,
  useApplyDiscount,
} from '@/app/_module/services';
import { showToast } from '@/app/_module/lib/notify';
import {
  TicketPackage,
  BuyTicketForm,
  TicketSummary,
  EmptyTicketState,
  TicketFormSkeleton,
  PaymentSuccess,
} from '../components';
import { useMakePayment } from '@/hooks/useMakePayment';

export default function BuyTicket() {
  const router = useRouter();
  const isTablet = useMediaQueryWatcher('(min-width: 768px)');
  const { makePayment } = useMakePayment();

  const {
    data: onSaleData,
    isLoading: isLoadingTickets,
    isRefetching: isRefetchingTickets,
    refetch: refetchTickets,
  } = useTicketsOnSale();

  const packages: TicketPackage[] = (onSaleData?.data || []).map((ticket) => {
    const price = Number.parseFloat(ticket.price) || 0;
    return {
      id: ticket.slug,
      title: ticket.name,
      badge: ticket.description || 'Access Pass',
      price,
      formattedPrice: `₦ ${price.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    };
  });

  // ── View state ────────────────────────────────────────────────────────────
  const [view, setView] = useState<'form' | 'summary' | 'success'>('form');

  // ── Buyer fields ──────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState<string | null>(null);

  // ── Gift mode ─────────────────────────────────────────────────────────────
  const [isGift, setIsGift] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

  // ── Package selection ─────────────────────────────────────────────────────
  const [selectedPackageId, setSelectedPackageId] = useState('');

  // ── Discount ──────────────────────────────────────────────────────────────
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState('');

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { mutate: applyDiscount, isPending: isApplyingDiscount } =
    useApplyDiscount();

  // ── Discount handlers ─────────────────────────────────────────────────────
  const handleApplyDiscount = (codeToApply: string) => {
    const cleanCode = codeToApply.trim();
    if (!cleanCode) return;

    setDiscountError('');
    applyDiscount(cleanCode, {
      onSuccess: (data) => {
        if (!data.isActive) {
          const msg = 'This discount code is no longer active';
          setDiscountError(msg);
          showToast.error(msg);
          setAppliedDiscount(null);
          return;
        }

        const amountNum = Number.parseFloat(data.amount) || 0;
        setAppliedDiscount({
          code: cleanCode.toUpperCase(),
          amount: amountNum,
        });
        setDiscountError('');
        showToast.success('Discount applied successfully');
      },
      onError: (err: Error) => {
        const msg = err.message || 'Discount not found';
        setDiscountError(msg);
        showToast.error(msg);
        setAppliedDiscount(null);
      },
    });
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
    showToast.info('Discount removed');
  };

  // ── When gift mode is toggled off, clear recipient fields ─────────────────
  const handleSetIsGift = (val: boolean) => {
    setIsGift(val);
    if (!val) {
      setReceiverName('');
      setReceiverEmail('');
      setReceiverPhone('');
    }
  };

  // ── Auto-select first package when tickets load ───────────────────────────
  useEffect(() => {
    if (packages.length > 0) {
      if (
        !selectedPackageId ||
        !packages.some((p) => p.id === selectedPackageId)
      ) {
        setSelectedPackageId(packages[0].id);
      }
    }
  }, [packages, selectedPackageId]);

  const selectedPackage =
    packages.find((p) => p.id === selectedPackageId) || packages[0];

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('summary');
  };

  const handlePay = () => {
    const orderPayload = isGift
      ? {
          slug: selectedPackage.id,
          attendee: {
            fullName: receiverName.trim(),
            email: receiverEmail.trim(),
            phoneNumber: receiverPhone.trim() || undefined,
          },
          gifter: {
            fullName: fullName.trim(),
            email: email.trim(),
          },
          discountCode: appliedDiscount?.code || '',
        }
      : {
          slug: selectedPackage.id,
          attendee: {
            fullName: fullName.trim(),
            email: email.trim(),
          },
          discountCode: appliedDiscount?.code || '',
        };

    createOrder(orderPayload, {
      onSuccess: (data) => {
        setReference(data.reference);
        makePayment({
          amount: Number(data.amount) * 100,
          orderId: data.id,
          reference: data.reference,
          customerEmail: isGift ? receiverEmail.trim() : email.trim(),
          customerFullName: isGift ? receiverName.trim() : fullName.trim(),
          paymentDescription: `Paymemnt for the Purchase of ${selectedPackage.title} ticket.`,
          onComplete: () => {
            setView('success');
          },
        });
      },
    });
  };

  const handleBack = () => {
    if (view === 'summary') {
      setView('form');
    } else {
      router.back();
    }
  };

  const handleResetToForm = () => {
    setFullName('');
    setEmail('');
    setReference(null);
    setIsGift(false);
    setReceiverName('');
    setReceiverEmail('');
    setReceiverPhone('');
    if (packages.length > 0) {
      setSelectedPackageId(packages[0].id);
    }
    setDiscountCode('');
    setAppliedDiscount(null);
    setDiscountError('');
    setView('form');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const renderContent = () => {
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
              isGift={isGift}
              receiverName={receiverName}
              receiverEmail={receiverEmail}
              receiverPhone={receiverPhone}
              selectedPackage={selectedPackage}
              appliedDiscount={appliedDiscount}
              onBack={handleBack}
              onPay={handlePay}
              isLoading={isPending}
            />
          </motion.div>
        )}

        {view === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full flex justify-center z-10"
          >
            <PaymentSuccess
              reference={reference!}
              onReset={handleResetToForm}
              resetButtonLabel="Buy Another Ticket"
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
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
      {renderContent()}

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
