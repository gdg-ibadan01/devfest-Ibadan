'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { AddAttendeeForm, TicketPackage } from '../_types/attendee.types';

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */
const TICKET_PACKAGES: TicketPackage[] = [
  { id: 'friday-workshop', days: 'Friday', type: 'Workshop', price: '₦ 4,000.00' },
  { id: 'saturday-main', days: 'Saturday', type: 'Main event & Workshop', price: '₦ 8,000.00' },
  { id: 'fri-sat-main-workshop', days: 'Friday & Saturday', type: 'Main event & Workshop', price: '₦ 8,000.00' },
  { id: 'fri-sat-main', days: 'Friday & Saturday', type: 'Main event', price: '₦ 8,000.00' },
];

const INITIAL_FORM: AddAttendeeForm = {
  fullName: '',
  email: '',
  ticketPackage: 'friday-workshop',
};

/* ------------------------------------------------------------------ */
/* QR Code SVG (decorative placeholder)                                 */
/* ------------------------------------------------------------------ */
function QRCodePlaceholder() {
  return (
    <div className="border-2 border-[#4285F4] rounded-lg p-4 bg-white flex items-center justify-center relative">
      {/* Inner dashed rect */}
      <div className="absolute inset-4 border border-dashed border-[#4285F4] rounded pointer-events-none" />
      {/* Simple QR-like SVG */}
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top-left finder */}
        <rect x="10" y="10" width="60" height="60" rx="4" fill="black" />
        <rect x="20" y="20" width="40" height="40" rx="2" fill="white" />
        <rect x="28" y="28" width="24" height="24" rx="1" fill="black" />
        {/* Top-right finder */}
        <rect x="150" y="10" width="60" height="60" rx="4" fill="black" />
        <rect x="160" y="20" width="40" height="40" rx="2" fill="white" />
        <rect x="168" y="28" width="24" height="24" rx="1" fill="black" />
        {/* Bottom-left finder */}
        <rect x="10" y="150" width="60" height="60" rx="4" fill="black" />
        <rect x="20" y="160" width="40" height="40" rx="2" fill="white" />
        <rect x="28" y="168" width="24" height="24" rx="1" fill="black" />
        {/* Data modules (simplified pattern) */}
        <rect x="90" y="10" width="8" height="8" fill="black" /><rect x="106" y="10" width="8" height="8" fill="black" />
        <rect x="82" y="26" width="8" height="8" fill="black" /><rect x="98" y="26" width="8" height="8" fill="black" /><rect x="114" y="26" width="8" height="8" fill="black" /><rect x="130" y="26" width="8" height="8" fill="black" />
        <rect x="90" y="42" width="8" height="8" fill="black" /><rect x="122" y="42" width="8" height="8" fill="black" />
        <rect x="82" y="58" width="8" height="8" fill="black" /><rect x="106" y="58" width="8" height="8" fill="black" /><rect x="130" y="58" width="8" height="8" fill="black" />
        <rect x="10" y="82" width="8" height="8" fill="black" /><rect x="26" y="82" width="8" height="8" fill="black" /><rect x="58" y="82" width="8" height="8" fill="black" /><rect x="82" y="82" width="8" height="8" fill="black" /><rect x="114" y="82" width="8" height="8" fill="black" /><rect x="146" y="82" width="8" height="8" fill="black" />
        <rect x="18" y="98" width="8" height="8" fill="black" /><rect x="50" y="98" width="8" height="8" fill="black" /><rect x="90" y="98" width="8" height="8" fill="black" /><rect x="122" y="98" width="8" height="8" fill="black" /><rect x="154" y="98" width="8" height="8" fill="black" />
        <rect x="10" y="114" width="8" height="8" fill="black" /><rect x="42" y="114" width="8" height="8" fill="black" /><rect x="74" y="114" width="8" height="8" fill="black" /><rect x="106" y="114" width="8" height="8" fill="black" /><rect x="138" y="114" width="8" height="8" fill="black" />
        <rect x="26" y="130" width="8" height="8" fill="black" /><rect x="58" y="130" width="8" height="8" fill="black" /><rect x="82" y="130" width="8" height="8" fill="black" /><rect x="114" y="130" width="8" height="8" fill="black" /><rect x="146" y="130" width="8" height="8" fill="black" />
        <rect x="90" y="154" width="8" height="8" fill="black" /><rect x="122" y="154" width="8" height="8" fill="black" /><rect x="154" y="154" width="8" height="8" fill="black" />
        <rect x="82" y="170" width="8" height="8" fill="black" /><rect x="106" y="170" width="8" height="8" fill="black" /><rect x="138" y="170" width="8" height="8" fill="black" />
        <rect x="90" y="186" width="8" height="8" fill="black" /><rect x="114" y="186" width="8" height="8" fill="black" /><rect x="146" y="186" width="8" height="8" fill="black" /><rect x="162" y="186" width="8" height="8" fill="black" />
        <rect x="170" y="90" width="8" height="8" fill="black" /><rect x="186" y="90" width="8" height="8" fill="black" /><rect x="202" y="90" width="8" height="8" fill="black" />
        <rect x="178" y="106" width="8" height="8" fill="black" /><rect x="202" y="106" width="8" height="8" fill="black" />
        <rect x="162" y="122" width="8" height="8" fill="black" /><rect x="186" y="122" width="8" height="8" fill="black" />
        <rect x="170" y="138" width="8" height="8" fill="black" /><rect x="194" y="138" width="8" height="8" fill="black" />
        <rect x="162" y="162" width="8" height="8" fill="black" /><rect x="186" y="162" width="8" height="8" fill="black" /><rect x="202" y="162" width="8" height="8" fill="black" />
        <rect x="170" y="178" width="8" height="8" fill="black" /><rect x="194" y="178" width="8" height="8" fill="black" />
        <rect x="162" y="194" width="8" height="8" fill="black" /><rect x="178" y="194" width="8" height="8" fill="black" /><rect x="202" y="194" width="8" height="8" fill="black" />
      </svg>

      {/* Overlapping avatars */}
      <div className="absolute bottom-6 right-10 flex -space-x-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold border-2 border-white shadow"
          style={{ background: 'linear-gradient(135deg, #c471ed, #f64f59)' }}>
          M
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold border-2 border-white shadow"
          style={{ background: 'linear-gradient(135deg, #4285F4, #56CCF2)' }}>
          A
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Success illustration                                                  */
/* ------------------------------------------------------------------ */
function SuccessIllustration() {
  return (
    <div className="relative w-40 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 140" fill="none">
        <circle cx="80" cy="20" r="4" fill="#34A853" />
        <circle cx="24" cy="76" r="3" fill="#34A853" />
        <circle cx="132" cy="88" r="3" fill="#34A853" />
        <text x="108" y="26" fontSize="14" fill="#FBBC04">✦</text>
        <text x="18" y="42" fontSize="10" fill="#FBBC04">✦</text>
        <text x="122" y="54" fontSize="8" fill="#FBBC04">✦</text>
        <text x="28" y="108" fontSize="10" fill="#FBBC04">✦</text>
        <text x="94" y="120" fontSize="10" fill="#FBBC04">✦</text>
        <rect x="4" y="66" width="28" height="7" rx="3.5" fill="#E5E7EB" />
        <rect x="128" y="66" width="28" height="7" rx="3.5" fill="#E5E7EB" />
        <rect x="0" y="78" width="22" height="7" rx="3.5" fill="#E5E7EB" opacity="0.6" />
        <rect x="138" y="78" width="22" height="7" rx="3.5" fill="#E5E7EB" opacity="0.6" />
      </svg>
      <div className="w-20 h-20 rounded-full bg-[#34A853] flex items-center justify-center z-10 shadow-lg">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M8 18L15 25L28 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */
type Step = 'form' | 'payment' | 'success';

interface AddAttendeeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAttendeeModal({ open, onClose }: AddAttendeeModalProps) {
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
      <div className="absolute inset-0 bg-black/40" onClick={step === 'success' ? undefined : handleClose} aria-hidden />

      <div className="relative bg-white rounded-2xl w-full max-w-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10">

        {/* Header (form + payment steps only) */}
        {step !== 'success' && (
          <div className="flex items-center gap-3 px-6 py-5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-600"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-[17px] font-bold text-gray-900">{stepTitle}</h2>
          </div>
        )}

        {/* ---- STEP: FORM ---- */}
        {step === 'form' && (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Full Name */}
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-2">Full Name</p>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Enter Full Name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-2">Email Address</p>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
                      onClick={() => setForm((f) => ({ ...f, ticketPackage: pkg.id }))}
                      className={cn(
                        'flex items-center gap-3 px-4 py-4 rounded-xl border bg-white transition-all text-left',
                        selected ? 'border-[#4285F4]' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {/* Radio */}
                      <span className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        selected ? 'border-[#4285F4]' : 'border-gray-300'
                      )}>
                        {selected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                        )}
                      </span>

                      {/* Day name */}
                      <span className={cn(
                        'text-[14px] font-semibold',
                        selected ? 'text-[#4285F4]' : 'text-gray-800'
                      )}>
                        {pkg.days}
                      </span>

                      {/* Type badge */}
                      <span className={cn(
                        'px-3 py-[3px] rounded-full text-[11px] font-medium border',
                        selected
                          ? 'bg-[#4285F4] text-white border-[#4285F4]'
                          : 'bg-white text-gray-500 border-gray-200'
                      )}>
                        {pkg.type}
                      </span>

                      {/* Price */}
                      <span className={cn(
                        'ml-auto text-[15px] font-bold',
                        selected ? 'text-[#4285F4]' : 'text-gray-800'
                      )}>
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
            <p className="text-center text-[15px] font-semibold text-gray-900">
              Kindly scan this QR Code to make Payment
            </p>

            <QRCodePlaceholder />

            {/* Info notice */}
            <div className="bg-gray-100 rounded-xl px-5 py-4">
              <p className="text-[13px] text-gray-600 leading-relaxed">
                You&apos;re about to send a payment link to the attendee&apos;s email. Please confirm
                that the email address is correct before proceeding.
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
            <SuccessIllustration />

            <div className="text-center">
              <h2 className="text-[20px] font-bold text-gray-900 mb-2">
                Payment link sent!
              </h2>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                The payment link has been sent to{' '}
                <span className="font-bold text-gray-800">{form.email || 'john.doe@example.com'}</span>.
                <br />
                Please inform the attendee to check their inbox (or spam folder) and
                complete the payment to secure their spot.
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
