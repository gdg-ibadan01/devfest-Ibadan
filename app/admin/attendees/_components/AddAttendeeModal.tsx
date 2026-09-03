'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import { useCreateAttendee } from '@/app/_module/services';
import type { AddAttendeeForm, TicketPackage } from '../_types/attendee.types';
import { TICKET_PACKAGES } from './TicketPackages';
import Image from 'next/image';
import Success from '../../../_module/components/icons/success.svg';

const INITIAL_FORM: AddAttendeeForm = {
  fullName: '',
  email: '',
  ticketPackage: 'friday-workshop',
};

type Step = 'form' | 'success';

interface Errors {
  fullName?: string;
  email?: string;
}

interface AddAttendeeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAttendeeModal({ open, onClose }: AddAttendeeModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<AddAttendeeForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});

  const { mutate: createAttendee, isPending } = useCreateAttendee();

  useEffect(() => {
    if (open) {
      setStep('form');
      setForm(INITIAL_FORM);
      setErrors({});
    }
  }, [open]);

  const handleClose = () => {
    setStep('form');
    setForm(INITIAL_FORM);
    setErrors({});
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const selectedPackage: TicketPackage | undefined = TICKET_PACKAGES.find((p) => p.id === form.ticketPackage);

  const handleSubmit = () => {
    if (!validate()) return;

    const amountRaw = selectedPackage
      ? parseFloat(selectedPackage.price.replace(/[^\d.]/g, ''))
      : undefined;

    createAttendee(
      {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        amount: !isNaN(amountRaw ?? NaN) ? amountRaw : undefined,
      },
      {
        onSuccess: () => setStep('success'),
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
            <h2 className="text-[17px] font-bold text-gray-900">Add New Attendee</h2>
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
              {errors.fullName && <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{errors.fullName}</p>}
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
              {errors.email && <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{errors.email}</p>}
            </div>

            {/* Ticket package */}
            <div className="bg-gray-50 rounded-xl px-5 py-5">
              <p className="text-[14px] font-semibold text-gray-800 mb-4">
                Kindly Select your Ticket Package
              </p>
              <div className="flex flex-col gap-3">
                {TICKET_PACKAGES.map((pkg) => {
                  const isSelected = form.ticketPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, ticketPackage: pkg.id }))}
                      className={cn(
                        'flex items-center gap-3 px-4 py-4 rounded-xl border bg-white transition-all text-left',
                        isSelected ? 'border-[#4285F4]' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0', isSelected ? 'border-[#4285F4]' : 'border-gray-300')}>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />}
                      </span>
                      <span className={cn('text-[14px] font-semibold', isSelected ? 'text-[#4285F4]' : 'text-gray-800')}>
                        {pkg.days}
                      </span>
                      <span className={cn('px-3 py-[3px] rounded-[24px] text-[11px] font-medium border', isSelected ? 'bg-[#4285F4] text-white border-[#4285F4]' : 'bg-white text-gray-500 border-gray-200')}>
                        {pkg.type}
                      </span>
                      <span className={cn('ml-auto text-[15px] font-bold', isSelected ? 'text-[#4285F4]' : 'text-gray-800')}>
                        {pkg.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !form.fullName || !form.email}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? 'Registering…' : 'Add Attendee'}
            </button>
          </div>
        )}

        {/* ── SUCCESS STEP ── */}
        {step === 'success' && (
          <div className="px-10 py-10 flex flex-col items-center gap-5">
            <Image src={Success} alt="Success" />
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-gray-900 mb-2">Attendee Added!</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                <span className="font-bold text-gray-800">{form.fullName}</span> has been successfully registered as an attendee.
              </p>
            </div>
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
