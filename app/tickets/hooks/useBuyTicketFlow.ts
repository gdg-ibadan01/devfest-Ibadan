'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateOrder, useCreateGroupBuyOrder } from '@/app/_module/services';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { showToast } from '@/app/_module/lib/notify';
import {
  confirmPayment,
  usePaymentLauncher,
} from '@/hooks/payments/usePaymentLauncher';
import { trackInitiateCheckout } from '@/utils/meta-pixel';
import { trackInitiateCheckout as trackTikTokInitiateCheckout } from '@/utils/tiktok-pixel';
import { trackInitiateCheckout as trackGAInitiateCheckout } from '@/utils/google-analytics';
import type { TicketPackage } from '../components';
import type { GroupMember } from '../components/GroupAttendeeFields';
import type { AppliedDiscount } from '@/app/_module/services/discount.service';
import type {
  CreateGroupBuyOrderDto,
  OrderConflictResponseDto,
  PaymentSession,
} from '@/app/_module/api/types';

/** The fields of a created order (single or group) that checkout needs. */
interface CreatedOrder {
  reference: string;
  amount: string;
  isFree: boolean;
  ticket: { name: string };
  payment?: PaymentSession | null;
}

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
  const { launch } = usePaymentLauncher();
  const queryClient = useQueryClient();
  const { mutate: createOrder, isPending: isSubmittingSingleOrder } =
    useCreateOrder();
  const { mutate: createGroupOrder, isPending: isSubmittingGroupOrder } =
    useCreateGroupBuyOrder();
  const [isLaunchingPayment, setIsLaunchingPayment] = useState(false);

  const isSubmittingOrder =
    isSubmittingSingleOrder || isSubmittingGroupOrder || isLaunchingPayment;

  // ── View state ────────────────────────────────────────────────────────────
  const [view, setView] = useState<TicketBuyView>('form');

  // ── Buyer fields ──────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState<string | null>(null);

  // ── Group members (for group ticket packages) ──────────────────────────────
  const isGroupTicket = Boolean(
    (selectedPackage?.seatsPerUnit && selectedPackage.seatsPerUnit > 1) ||
    selectedPackage?.id.toLowerCase().includes('group')
  );

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { fullName: '', email: '' },
    { fullName: '', email: '' },
  ]);

  // Dynamically sync group member slots to (seatsPerUnit - 1), preserving entered data
  useEffect(() => {
    if (!isGroupTicket || !selectedPackage) return;
    const targetCount = Math.max(2, (selectedPackage.seatsPerUnit || 3) - 1);
    setGroupMembers((prev) => {
      if (prev.length === targetCount) return prev;
      const next: GroupMember[] = [];
      for (let i = 0; i < targetCount; i++) {
        next.push(prev[i] ?? { fullName: '', email: '' });
      }
      return next;
    });
  }, [isGroupTicket, selectedPackage]);

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

  // ── Auto-reset gift mode when switching to a group ticket ────────────────
  useEffect(() => {
    if (isGroupTicket && isGift) {
      handleSetIsGift(false);
    }
  }, [isGroupTicket, isGift, handleSetIsGift]);

  // ── Form submission ───────────────────────────────────────────────────────
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setView('summary');
  }, []);

  // ── Checkout (gateway chosen by the server) ───────────────────────────────
  // Every outcome lands on the success view: it shows PAID, or "awaiting
  // payment" with a Complete Payment button that reuses this same order.
  const startCheckout = useCallback(
    (order: CreatedOrder, quantity: number) => {
      setReference(order.reference);
      if (order.isFree) {
        setView('success');
        return;
      }
      if (!order.payment) {
        setView('success');
        return;
      }

      const refreshOrder = () =>
        void queryClient.invalidateQueries({
          queryKey: queryKeys.orders.reference(order.reference),
        });
      const done = () => setIsLaunchingPayment(false);

      setIsLaunchingPayment(true);
      launch(order.payment, {
        onOpened: () => {
          done();
          const checkoutEvent = {
            amount: Number(order.amount),
            ticketType: order.ticket.name,
            quantity,
          };
          trackInitiateCheckout(checkoutEvent);
          trackTikTokInitiateCheckout(checkoutEvent);
          trackGAInitiateCheckout(checkoutEvent);
        },
        onSuccess: (transactionRef) => {
          done();
          setView('success');
          void confirmPayment(order.reference, transactionRef).finally(
            refreshOrder
          );
        },
        onPending: () => {
          done();
          setView('success');
        },
        onDismiss: () => {
          done();
          setView('success');
        },
        onFailed: (message) => {
          done();
          showToast.error(
            message || 'Payment was not completed. You can try again.'
          );
          setView('success');
        },
      }).catch((err: Error) => {
        done();
        showToast.error(err?.message || 'Could not open the payment window.');
        setView('success');
      });
    },
    [launch, queryClient]
  );

  // A 409 with `pendingReference` means this buyer already has an unpaid
  // order for the ticket: show it (with Complete Payment) instead of stalling.
  const resumePendingOrder = useCallback((error: Error) => {
    const pending = (error as { data?: Partial<OrderConflictResponseDto> })
      .data?.pendingReference;
    if (!pending) return;
    setReference(pending);
    setView('success');
  }, []);

  // ── Payment execution ─────────────────────────────────────────────────────
  const handlePay = useCallback(() => {
    if (!selectedPackage) return;

    if (isGroupTicket) {
      const groupPayload: CreateGroupBuyOrderDto = {
        slug: selectedPackage.id,
        discountCode: appliedDiscount?.code || undefined,
        group: {
          payer: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
          },
          members: groupMembers.map((m) => ({
            fullName: m.fullName.trim(),
            email: m.email.trim().toLowerCase(),
          })),
        },
      };

      createGroupOrder(groupPayload, {
        onSuccess: (data) => startCheckout(data, 1 + groupMembers.length),
        onError: resumePendingOrder,
      });
      return;
    }

    const orderPayload = isGift
      ? {
          slug: selectedPackage.id,
          attendee: {
            fullName: receiverName.trim(),
            email: receiverEmail.trim().toLowerCase(),
            phoneNumber: receiverPhone.trim() || undefined,
          },
          gifter: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
          },
          discountCode: appliedDiscount?.code || '',
        }
      : {
          slug: selectedPackage.id,
          attendee: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
          },
          discountCode: appliedDiscount?.code || '',
        };

    createOrder(orderPayload, {
      onSuccess: (data) => startCheckout(data, 1),
      onError: resumePendingOrder,
    });
  }, [
    selectedPackage,
    isGroupTicket,
    isGift,
    receiverName,
    receiverEmail,
    receiverPhone,
    fullName,
    email,
    groupMembers,
    appliedDiscount,
    createOrder,
    createGroupOrder,
    startCheckout,
    resumePendingOrder,
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
    setGroupMembers([
      { fullName: '', email: '' },
      { fullName: '', email: '' },
    ]);
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
  };
}
