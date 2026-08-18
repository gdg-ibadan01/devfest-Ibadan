'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { AddAttendeeForm, TicketPackage } from '../_types/attendee.types';
import { TICKET_PACKAGES } from './TicketPackages';
import Image from 'next/image';
import Success from '../../../_module/components/icons/success.svg';
import QRCodeGenerator from './QRCodeGenerator';

const INITIAL_FORM: AddAttendeeForm = {
  fullName: '',
  email: '',
  ticketPackage: 'friday-workshop',
};

type Step = 'form' | 'payment' | 'success';

interface AddAttendeeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAttendeeModal({
  open,
  onClose,
}: AddAttendeeModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<AddAttendeeForm>(INITIAL_FORM);

  useEffect(() => {
    if (open) {
      setStep('form');
      setForm(INITIAL_FORM);
    }
  }, [open]);

  const handleClose = () => {
    setStep('form');
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleBack = () => {
    if (step === 'payment') setStep('form');
    else handleClose();
  };

  if (!open) return null;

  const stepTitle = step === 'form' ? 'Add New Attendees' : 'Make Payment';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={step === 'success' ? undefined : handleClose}
        aria-hidden
      />

      <div className="relative bg-white rounded-2xl w-full max-w-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10">
        {/* Header */}
        {step !== 'success' && (
          <div className="flex items-center gap-3 px-6 py-5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-600"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-[17px] font-bold text-gray-900">{stepTitle}</h2>
          </div>
        )}

        {step === 'form' && (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Full Name */}
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-2">
                Full Name
              </p>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                placeholder="Enter Full Name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-2">
                Email Address
              </p>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="Enter email address"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            {/* Ticket package */}
            <div className="bg-gray-50 rounded-xl px-5 py-5">
              <p className="text-[14px] font-semibold text-gray-800 mb-4">
                Kindly Select your Ticket Package
              </p>
              <div className="flex flex-col gap-3">
                {TICKET_PACKAGES.map((pkg) => {
                  const selected = form.ticketPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, ticketPackage: pkg.id }))
                      }
                      className={cn(
                        'flex items-center gap-3 px-4 py-4 rounded-xl border bg-white transition-all text-left',
                        selected
                          ? 'border-[#4285F4]'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {/* Radio */}
                      <span
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          selected ? 'border-[#4285F4]' : 'border-gray-300'
                        )}
                      >
                        {selected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                        )}
                      </span>

                      {/* Day name */}
                      <span
                        className={cn(
                          'text-[14px] font-semibold',
                          selected ? 'text-[#4285F4]' : 'text-gray-800'
                        )}
                      >
                        {pkg.days}
                      </span>

                      {/* Type badge */}
                      <span
                        className={cn(
                          'px-3 py-[3px] rounded-[24px] text-[11px] font-medium border',
                          selected
                            ? 'bg-[#4285F4] text-white border-[#4285F4]'
                            : 'bg-white text-gray-500 border-gray-200'
                        )}
                      >
                        {pkg.type}
                      </span>

                      {/* Price */}
                      <span
                        className={cn(
                          'ml-auto text-[15px] font-bold',
                          selected ? 'text-[#4285F4]' : 'text-gray-800'
                        )}
                      >
                        {pkg.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue */}
            <button
              type="button"
              onClick={() => setStep('payment')}
              disabled={!form.fullName || !form.email}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* ---- STEP: PAYMENT ---- */}
        {step === 'payment' && (
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
            <p className="text-center text-[20px] font-semibold text-gray-900">
              Kindly scan this QR Code to make Payment
            </p>

            <QRCodeGenerator />

            {/* Info notice */}
            <div className="bg-gray-100 rounded-xl px-5 py-4">
              <p className="text-[13px] text-gray-600 leading-relaxed">
                You&apos;re about to send a payment link to the attendee&apos;s
                email. Please confirm that the email address is correct before
                proceeding.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('success')}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors"
            >
              Send payment link Instead
            </button>
          </div>
        )}

        {/* ---- STEP: SUCCESS ---- */}
        {step === 'success' && (
          <div className="px-10 py-10 flex flex-col items-center gap-5">
            <Image src={Success} alt="Success illustration image" />

            <div className="text-center">
              <h2 className="text-[20px] font-bold text-gray-900 mb-2">
                Payment link sent!
              </h2>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                The payment link has been sent to{' '}
                <span className="font-bold text-gray-800">
                  {form.email || 'john.doe@example.com'}
                </span>
                .
                <br />
                Please inform the attendee to check their inbox (or spam folder)
                and complete the payment to secure their spot.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
