'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateOrder } from '@/app/_module/services';
import { useMakePayment } from '@/hooks/useMakePayment';
import { trackPurchase } from '@/components/MetaPixel';
import type { TicketPackage } from '../components';
import type { AppliedDiscount } from '@/app/_module/services/discount.service';

export type TicketBuyView = 'form' | 'summary' | 'success';

interface UseBuyTicketFlowProps {
  selectedPackage?: TicketPackage;
  appliedDiscount: AppliedDiscount | null;
  onReset?: () => void;
}

export function useBuyTicketFlow({
  selectedPackage,
  appliedDiscount,
  onReset,
}: UseBuyTicketFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { makePayment } = useMakePayment();
  const { mutate: createOrder, isPending: isSubmittingOrder } = useCreateOrder();

  // ── View state ────────────────────────────────────────────────────────────
  const [view, setView] = useState<TicketBuyView>('form');

  // ── Buyer fields ──────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState<string | null>(null);

  // ── Gift mode ─────────────────────────────────────────────────────────────
  const [isGift, setIsGift] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

  // ── Read gift query parameter ─────────────────────────────────────────────
  useEffect(() => {
    const giftParam = searchParams.get('gift');
    if (giftParam === 'true' || giftParam === '1') {
      setIsGift(true);
    }
  }, [searchParams]);

  // ── When gift mode is toggled off, clear recipient fields ─────────────────
  const handleSetIsGift = useCallback((val: boolean) => {
    setIsGift(val);
    if (!val) {
      setReceiverName('');
      setReceiverEmail('');
      setReceiverPhone('');
    }
  }, []);

  // ── Form submission ───────────────────────────────────────────────────────
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setView('summary');
  }, []);

  // ── Payment execution ─────────────────────────────────────────────────────
  const handlePay = useCallback(() => {
    if (!selectedPackage) return;

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
          paymentDescription: `Payment for the Purchase of ${selectedPackage.title} ticket.`,
          onComplete: () => {
            const ticketPrice = Number(data.amount) || 0;
            trackPurchase(ticketPrice, data.reference);
            setView('success');
          },
        });
      },
    });
  }, [
    selectedPackage,
    isGift,
    receiverName,
    receiverEmail,
    receiverPhone,
    fullName,
    email,
    appliedDiscount,
    createOrder,
    makePayment,
  ]);

  // ── Navigation handlers ───────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (view === 'summary') {
      setView('form');
    } else {
      router.back();
    }
  }, [view, router]);

  const handleResetToForm = useCallback(() => {
    setFullName('');
    setEmail('');
    setReference(null);
    setIsGift(false);
    setReceiverName('');
    setReceiverEmail('');
    setReceiverPhone('');
    onReset?.();
    setView('form');
  }, [onReset]);

  return {
    view,
    setView,
    fullName,
    setFullName,
    email,
    setEmail,
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
  };
}
