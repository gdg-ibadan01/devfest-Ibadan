'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle2, Copy, Loader2, X } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import {
  useCheckInAttendee,
  useCreateOrderForAttendee,
  useOrderByReference,
  useRequeryPayment,
  useTickets,
} from '@/app/_module/services';
import { describeOutcome } from '@/app/_module/services/reconciliation.service';
import { eventDayKey, eventToday } from '@/app/_module/lib/eventDate';
import { showToast } from '@/app/_module/lib/notify';
import type { CreateOrderResponseDto } from '@/app/_module/api/types';

/**
 * Register someone at the door. Free / fully-discounted tickets are PAID on
 * creation and checked in straight away. Paid tickets show a pay-link QR for
 * the attendee's phone; the order is polled and checked in the moment the
 * payment lands (or staff press "Confirm payment" to re-check the gateway).
 */
interface WalkInModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'form' | 'pay' | 'done';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WalkInModal({ open, onClose }: WalkInModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [slug, setSlug] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [order, setOrder] = useState<CreateOrderResponseDto | null>(null);
  const checkedInRef = useRef(false);

  const { data: ticketsData, isLoading: ticketsLoading } = useTickets({
    limit: 50,
  });
  const today = eventToday();
  const tickets = useMemo(() => {
    const all = ticketsData?.data ?? [];
    // Tickets with an event day today first — those are the ones the door sells.
    return [...all].sort((a, b) => {
      const at = a.eventDates.some((d) => eventDayKey(d) === today) ? 0 : 1;
      const bt = b.eventDates.some((d) => eventDayKey(d) === today) ? 0 : 1;
      return at - bt;
    });
  }, [ticketsData, today]);

  const create = useCreateOrderForAttendee();
  const checkIn = useCheckInAttendee();
  const requery = useRequeryPayment();
  const live = useOrderByReference(
    step === 'pay' ? (order?.reference ?? null) : null
  );

  useEffect(() => {
    if (!open) return;
    setStep('form');
    setFullName('');
    setEmail('');
    setPhone('');
    setDiscountCode('');
    setOrder(null);
    checkedInRef.current = false;
  }, [open]);

  useEffect(() => {
    if (open && !slug && tickets[0]) setSlug(tickets[0].slug);
  }, [open, slug, tickets]);

  const finishWithCheckIn = (orderId: string) => {
    if (checkedInRef.current) return;
    checkedInRef.current = true;
    checkIn.mutate(
      { orderId },
      {
        onSuccess: () => setStep('done'),
        // e.g. ticket not valid today — the order is still created and paid.
        onError: () => {
          checkedInRef.current = false;
          setStep('done');
        },
      }
    );
  };

  // Paid while we were showing the QR → check in automatically.
  useEffect(() => {
    if (step === 'pay' && order && live.data?.status === 'PAID') {
      finishWithCheckIn(order.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, order, live.data?.status]);

  if (!open) return null;

  const valid =
    fullName.trim().length >= 2 && EMAIL_RE.test(email.trim()) && !!slug;

  const submit = () => {
    if (!valid) return;
    create.mutate(
      {
        slug,
        attendee: {
          fullName: fullName.trim(),
          email: email.trim(),
          ...(phone.trim() ? { phoneNumber: phone.trim() } : {}),
        },
        discountCode: discountCode.trim(),
        skipSaleWindowCheck: true,
      },
      {
        onSuccess: (res) => {
          setOrder(res);
          if (res.status === 'PAID') {
            finishWithCheckIn(res.id);
          } else {
            setStep('pay');
          }
        },
      }
    );
  };

  const payUrl =
    order && typeof window !== 'undefined'
      ? `${window.location.origin}/tickets/pay/${encodeURIComponent(order.reference)}`
      : '';

  const confirmPayment = () => {
    if (!order) return;
    requery.mutate(
      { reference: order.reference },
      {
        onSuccess: (res) => {
          if (res.status === 'PAID') {
            finishWithCheckIn(order.id);
          } else {
            showToast.warning(describeOutcome(res.outcome), { duration: 6000 });
          }
        },
        onError: (err) =>
          showToast.error(err.message || 'Could not reach the gateway'),
      }
    );
  };

  const input =
    'w-full rounded-lg border border-gray-200 px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={step === 'pay' ? undefined : onClose}
        aria-hidden
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-[16px] font-bold text-gray-900">
            Walk-in registration
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {step === 'form' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex flex-col gap-4"
            >
              <input
                className={input}
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
              />
              <input
                className={input}
                placeholder="Email address (ticket is emailed here)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className={input}
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div>
                <p className="mb-2 text-[13px] font-medium text-gray-800">
                  Ticket
                </p>
                {ticketsLoading ? (
                  <div className="h-[48px] animate-pulse rounded-lg bg-gray-100" />
                ) : (
                  <div className="flex flex-col gap-2">
                    {tickets.map((t) => {
                      const todayTicket = t.eventDates.some(
                        (d) => eventDayKey(d) === today
                      );
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSlug(t.slug)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[13px]',
                            slug === t.slug
                              ? 'border-[#4285F4] bg-[#4285F4]/5'
                              : 'border-gray-200 hover:bg-gray-50'
                          )}
                        >
                          <span className="flex-1 font-semibold text-gray-800">
                            {t.name}
                          </span>
                          {todayTicket && (
                            <span className="rounded-full bg-[#E8F5E9] px-2 py-[2px] text-[11px] font-medium text-[#1B873B]">
                              Today
                            </span>
                          )}
                          <span className="font-bold text-gray-800">
                            ₦{parseFloat(t.price).toLocaleString('en-NG')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <input
                className={input}
                placeholder="Discount code (optional)"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                autoCapitalize="characters"
              />

              <button
                type="submit"
                disabled={!valid || create.isPending || checkIn.isPending}
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
              >
                {(create.isPending || checkIn.isPending) && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Register
              </button>
            </form>
          )}

          {step === 'pay' && order && (
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-[14px] text-gray-700">
                Ask <span className="font-semibold">{fullName.trim()}</span> to
                scan this with their phone and pay{' '}
                <span className="font-semibold">
                  ₦{parseFloat(order.amount).toLocaleString('en-NG')}
                </span>
                .
              </p>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <QRCode value={payUrl} size={196} />
              </div>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard
                    ?.writeText(payUrl)
                    .then(() => showToast.success('Pay link copied'))
                }
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4285F4]"
              >
                <Copy size={13} /> Copy pay link
              </button>
              <p className="flex items-center gap-2 text-[12px] text-gray-500">
                <Loader2 size={13} className="animate-spin" /> Waiting for
                payment — they&apos;ll be checked in automatically.
              </p>
              <button
                type="button"
                onClick={confirmPayment}
                disabled={requery.isPending || checkIn.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
              >
                {(requery.isPending || checkIn.isPending) && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                They&apos;ve paid — confirm &amp; check in
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-[12px] text-gray-500 hover:text-gray-800"
              >
                Close (order stays open; it&apos;s checked in from Attendees
                once paid)
              </button>
            </div>
          )}

          {step === 'done' && order && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 size={40} className="text-[#34A853]" />
              <p className="text-[16px] font-bold text-gray-900">
                {checkedInRef.current
                  ? 'Registered and checked in'
                  : 'Registered'}
              </p>
              <p className="text-[13px] text-gray-600">
                Ticket code{' '}
                <span className="font-mono font-semibold">
                  {order.reference.slice(-6)}
                </span>{' '}
                — the ticket is being emailed to {email.trim()}.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full rounded-xl bg-gray-900 py-3 text-[14px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
