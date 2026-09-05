'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { CreateOrderForm } from '../_types/order.types';
import type { CreateOrderResponseDto } from '@/app/_module/api/types';
import Image from 'next/image';
import Success from '../../../_module/components/icons/success.svg';
import { useCreateOrder } from '@/app/_module/services/order.service';
import { useTickets } from '@/app/_module/services';

const INITIAL_FORM: CreateOrderForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  ticketSlug: '',
};

type Step = 'form' | 'success';

interface Errors {
  fullName?: string;
  email?: string;
  ticketSlug?: string;
}

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrderModal({
  open,
  onClose,
}: CreateOrderModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<CreateOrderForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [order, setOrder] = useState<CreateOrderResponseDto | null>(null);

  // All tickets that have been created (with prices), as requested — not
  // limited to tickets currently on sale.
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets({
    limit: 20,
  });
  const tickets = ticketsData?.data ?? [];

  const { mutate: createOrder, isPending } = useCreateOrder();

  useEffect(() => {
    if (open) {
      setStep('form');
      setForm(INITIAL_FORM);
      setErrors({});
      setOrder(null);
    }
  }, [open]);

  // Default to the first available ticket once loaded
  const firstTicketSlug = tickets[0]?.slug;
  useEffect(() => {
    if (open && firstTicketSlug && !form.ticketSlug) {
      setForm((f) => ({ ...f, ticketSlug: firstTicketSlug }));
    }
  }, [open, firstTicketSlug, form.ticketSlug]);

  const handleClose = () => {
    setStep('form');
    setForm(INITIAL_FORM);
    setErrors({});
    setOrder(null);
    onClose();
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!form.ticketSlug) e.ticketSlug = 'Please select a ticket package.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const selectedTicket = tickets.find((t) => t.slug === form.ticketSlug);

  const handleSubmit = () => {
    if (!validate()) return;

    createOrder(
      {
        slug: form.ticketSlug,
        attendee: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          ...(form.phoneNumber.trim()
            ? { phoneNumber: form.phoneNumber.trim() }
            : {}),
        },
      },
      {
        onSuccess: (res) => {
          setOrder(res);
          setStep('success');
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={step === 'success' ? undefined : handleClose}
        aria-hidden
      />

      <div className="relative bg-white rounded-2xl w-full max-w-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10">
        {/* Header */}
        {step === 'form' && (
          <div className="flex items-center gap-3 px-6 py-5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-600 p-1"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-[17px] font-bold text-gray-900">
              Create New Order
            </h2>
          </div>
        )}

        {/* ── FORM STEP ── */}
        {step === 'form' && (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Full Name */}
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-2">
                Full Name <span style={{ color: '#E61530' }}>*</span>
              </p>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => {
                  setForm((f) => ({ ...f, fullName: e.target.value }));
                  setErrors((p) => ({ ...p, fullName: undefined }));
                }}
                placeholder="Enter Full Name"
                className={cn(
                  'w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none transition-colors bg-white',
                  errors.fullName ? '' : 'border-gray-200 focus:border-gray-400'
                )}
                style={errors.fullName ? { borderColor: '#E61530' } : undefined}
              />
              {errors.fullName && (
                <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-2">
                Email Address <span style={{ color: '#E61530' }}>*</span>
              </p>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="Enter email address"
                className={cn(
                  'w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none transition-colors bg-white',
                  errors.email ? '' : 'border-gray-200 focus:border-gray-400'
                )}
                style={errors.email ? { borderColor: '#E61530' } : undefined}
              />
              {errors.email && (
                <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone number (optional) */}
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-2">
                Phone Number
              </p>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phoneNumber: e.target.value }))
                }
                placeholder="Enter phone number"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            {/* Ticket package — all tickets that have been created, with prices */}
            <div className="bg-gray-50 rounded-xl px-5 py-5">
              <p className="text-[14px] font-semibold text-gray-800 mb-4">
                Kindly Select your Ticket Package
              </p>
              {ticketsLoading ? (
                <div className="flex flex-col gap-3">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="h-[68px] rounded-xl bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <p className="text-[13px] text-gray-400">
                  No tickets have been created yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {tickets.map((pkg) => {
                    const isSelected = form.ticketSlug === pkg.slug;
                    return (
                      <button
                        key={pkg.slug}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, ticketSlug: pkg.slug }));
                          setErrors((p) => ({ ...p, ticketSlug: undefined }));
                        }}
                        className={cn(
                          'flex items-center gap-2 px-4 py-4 rounded-lg border bg-white transition-all text-left',
                          isSelected
                            ? 'border-[#4285F4]'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <span
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                            isSelected ? 'border-[#4285F4]' : 'border-gray-300'
                          )}
                        >
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                          )}
                        </span>
                        <span
                          className={cn(
                            'text-[14px] font-semibold',
                            isSelected ? 'text-[#4285F4]' : 'text-gray-800'
                          )}
                        >
                          {pkg.name}
                        </span>
                        {pkg?.eventDates?.map((date) => (
                          <span
                            key={date}
                            className={cn(
                              'px-3 py-[3px] rounded-[24px] text-[11px] font-medium border',
                              isSelected
                                ? 'bg-[#4285F4] text-white border-[#4285F4]'
                                : 'bg-[#FAFAFA] text-[#4D4D4D] border-[#A9A9A9]'
                            )}
                          >
                            {new Date(date).toLocaleDateString('en-US', {
                              weekday: 'long',
                            })}
                          </span>
                        ))}

                        <span
                          className={cn(
                            'ml-auto text-[15px] font-bold',
                            isSelected ? 'text-[#4285F4]' : 'text-gray-800'
                          )}
                        >
                          ₦{parseFloat(pkg.price).toLocaleString('en-NG')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.ticketSlug && (
                <p className="mt-2 text-[12px]" style={{ color: '#E61530' }}>
                  {errors.ticketSlug}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isPending || !form.fullName || !form.email || !form.ticketSlug
              }
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating order…' : 'Create Order'}
            </button>
          </div>
        )}

        {/* ── SUCCESS STEP ── */}
        {step === 'success' && (
          <div className="px-10 py-10 flex flex-col items-center gap-5">
            <Image src={Success} alt="Success" />
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-gray-900 mb-2">
                Order Created Successfully!
              </h2>
              {/* <p className="text-[13px] text-gray-500 leading-relaxed">
                <span className="font-bold text-gray-800">{form.fullName}</span>{' '}
                has been registered for{' '}
                <span className="font-semibold text-gray-800">
                  {selectedTicket?.name}
                </span>
                .
                {order?.checkoutUrl
                  ? ' Share the payment link below with the attendee to complete payment.'
                  : ' The order is now awaiting payment.'}
              </p> */}
            </div>

            {order?.checkoutUrl && (
              <a
                href={order.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors truncate"
              >
                Open Payment Link
              </a>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
