'use client';

import { useEffect, useState } from 'react';
import { Check, ShieldCheck, XCircle } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import { useTickets } from '@/app/_module/services';
import { useCreateDiscount } from '@/app/_module/services/discounts.service';
import { DatePickerInput } from '@/app/_module/components/ui/DatePicker';
import type { CreateDiscountForm, DiscountKind } from '../_types/discount.types';
import type { CreateDiscountDto } from '@/app/_module/api/types';

const INITIAL_FORM: CreateDiscountForm = {
  name: '',
  type: 'SINGLE',
  amount: '',
  ticketSlugs: [],
  limit: '',
  validFrom: '',
  endDate: '',
  forFirstTimersOnly: false,
  recipientEmails: '',
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-[13px] font-medium text-gray-800 mb-2">
      {children}
      {required && <span style={{ color: '#E61530' }} className="ml-1">*</span>}
    </p>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{message}</p>;
}

function TextInput({
  placeholder,
  value,
  onChange,
  error,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full border rounded-md px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none transition-colors bg-transparent',
          error ? '' : 'border-gray-200 focus:border-gray-400'
        )}
        style={error ? { borderColor: '#E61530' } : undefined}
      />
      <FieldError message={error} />
    </div>
  );
}

/* Radio-style toggle button (single-select) */
function RadioToggle({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-[13px] font-medium flex-1 transition-all',
        selected
          ? 'border-gray-900 bg-white text-gray-900'
          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
      )}
    >
      <span>{label}</span>
      {selected ? (
        <span className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
          <Check size={11} className="text-white" strokeWidth={3} />
        </span>
      ) : (
        <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
      )}
    </button>
  );
}

/* Multi-select chip (Ticket selection) */
function MultiChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex items-center gap-2 px-4 py-[10px] rounded-lg border text-[13px] transition-all',
        selected
          ? 'border-gray-900 bg-white text-gray-900'
          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
      )}
    >
      <span>{label}</span>
      {selected ? (
        <span className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
          <Check size={11} className="text-white" strokeWidth={3} />
        </span>
      ) : (
        <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
      )}
    </button>
  );
}

/* Naira amount input with proper thousands-separator formatting */
function formatAmountDisplay(raw: string): string {
  if (!raw) return '';
  const parts = raw.split('.');
  const intPart = parts[0].replace(/\D/g, '');
  const formattedInt = intPart ? parseInt(intPart, 10).toLocaleString('en-NG') : '';
  if (parts.length > 1) return `${formattedInt}.${parts[1]}`;
  return formattedInt;
}

function AmountInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      onChange(raw);
    }
  };
  return (
    <div>
      <div
        className={cn(
          'flex items-center border rounded-lg overflow-hidden transition-colors bg-white focus-within:ring-2 focus-within:ring-black/10',
          error ? '' : 'border-gray-200 focus-within:border-gray-400'
        )}
        style={error ? { borderColor: '#E61530' } : undefined}
      >
        <span className="px-4 py-3 text-[13px] text-gray-500 border-r border-gray-200 bg-gray-50 whitespace-nowrap select-none">
          NGN (Naira)
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={formatAmountDisplay(value)}
          onChange={handleChange}
          placeholder="0.00"
          className="flex-1 px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

/* Toggle switch */
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex w-[32px] h-[16px] rounded-[24px] transition-colors duration-200 focus:outline-none flex-shrink-0',
        checked ? 'bg-[#2E335B]' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'inline-block w-[14px] h-[14px] rounded-full bg-white shadow-sm absolute top-[1px] transition-transform duration-200',
          checked ? 'translate-x-[17px]' : 'translate-x-[2px]'
        )}
      />
    </button>
  );
}

interface Errors {
  name?: string;
  amount?: string;
  ticketSlugs?: string;
  limit?: string;
  validFrom?: string;
  recipientEmails?: string;
}

interface CreateDiscountModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateDiscountModal({
  open,
  onClose,
  onCreated,
}: CreateDiscountModalProps) {
  const [form, setForm] = useState<CreateDiscountForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});

  const { data: ticketsData } = useTickets({ limit: 50 });
  const tickets = ticketsData?.data ?? [];

  const { mutate: createDiscount, isPending } = useCreateDiscount();

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  }, [open]);

  const patch = <K extends keyof CreateDiscountForm>(
    key: K,
    value: CreateDiscountForm[K]
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleTicket = (slug: string) => {
    setForm((f) => ({
      ...f,
      ticketSlugs: f.ticketSlugs.includes(slug)
        ? f.ticketSlugs.filter((s) => s !== slug)
        : [...f.ticketSlugs, slug],
    }));
    setErrors((prev) => ({ ...prev, ticketSlugs: undefined }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Discount name is required.';

    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount < 1) {
      e.amount = 'Amount must be at least ₦1.';
    }

    if (form.ticketSlugs.length === 0) {
      e.ticketSlugs = 'Select at least one ticket.';
    }

    if (!form.validFrom) e.validFrom = 'Valid from date is required.';

    if (form.type === 'BULK') {
      const limit = parseInt(form.limit, 10);
      if (!form.limit || isNaN(limit) || limit < 1) {
        e.limit = 'Limit is required for bulk discounts.';
      }
      const emails = form.recipientEmails
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (emails.length === 0) {
        e.recipientEmails = 'At least one recipient email is required for bulk discounts.';
      } else if (!isNaN(limit) && emails.length > limit) {
        e.recipientEmails = `Cannot exceed the limit of ${limit} recipient(s).`;
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: CreateDiscountDto = {
      name: form.name.trim(),
      type: form.type,
      amount: parseFloat(form.amount),
      ticketSlugs: form.ticketSlugs,
      validFrom: form.validFrom,
      forFirstTimersOnly: form.forFirstTimersOnly,
      ...(form.type === 'BULK'
        ? {
            limit: parseInt(form.limit, 10),
            recipientEmails: form.recipientEmails
              .split(/[\n,]/)
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {}),
    };

    createDiscount(payload, {
      onSuccess: () => {
        onCreated?.();
        handleClose();
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={handleClose} aria-hidden />

      {/* Panel */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[520px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px] h-[calc(100vh-20px)]">
        {/* Header */}
        <div className="flex items-center justify-between p-[24px] border-b border-gray-100 bg-[#FAFAFA] flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">
            Create Discount
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-auto px-[30px] py-6 space-y-6">
          {/* Discount Name */}
          <div>
            <FieldLabel required>Discount Name</FieldLabel>
            <TextInput
              placeholder="Input Discount Name"
              value={form.name}
              onChange={(v) => patch('name', v)}
              error={errors.name}
            />
          </div>

          {/* Discount Type */}
          <div>
            <FieldLabel required>Discount Type</FieldLabel>
            <div className="flex gap-3">
              <RadioToggle
                label="Single Use"
                selected={form.type === 'SINGLE'}
                onSelect={() => patch('type', 'SINGLE' as DiscountKind)}
              />
              <RadioToggle
                label="Bulk (multiple recipients)"
                selected={form.type === 'BULK'}
                onSelect={() => patch('type', 'BULK' as DiscountKind)}
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <FieldLabel required>Amount</FieldLabel>
            <AmountInput
              value={form.amount}
              onChange={(v) => patch('amount', v)}
              error={errors.amount}
            />
          </div>

          {/* Applicable tickets */}
          <div>
            <FieldLabel required>Applicable Tickets</FieldLabel>
            <div className="flex gap-3 flex-wrap">
              {tickets.length === 0 ? (
                <p className="text-[12px] text-gray-400">No tickets available.</p>
              ) : (
                tickets.map((t) => (
                  <MultiChip
                    key={t.slug}
                    label={`${t.name} (₦${parseFloat(t.price).toLocaleString('en-NG')})`}
                    selected={form.ticketSlugs.includes(t.slug)}
                    onToggle={() => toggleTicket(t.slug)}
                  />
                ))
              )}
            </div>
            <FieldError message={errors.ticketSlugs} />
          </div>

          {/* Bulk-only fields */}
          {form.type === 'BULK' && (
            <>
              <div>
                <FieldLabel required>Usage Limit</FieldLabel>
                <input
                  type="number"
                  min="1"
                  value={form.limit}
                  onChange={(e) => patch('limit', e.target.value)}
                  placeholder="Maximum number of times this can be used"
                  className={cn(
                    'w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none transition-colors bg-white',
                    errors.limit ? '' : 'border-gray-200 focus:border-gray-400'
                  )}
                  style={errors.limit ? { borderColor: '#E61530' } : undefined}
                />
                <FieldError message={errors.limit} />
              </div>

              <div>
                <FieldLabel required>Recipient Emails</FieldLabel>
                <textarea
                  value={form.recipientEmails}
                  onChange={(e) => patch('recipientEmails', e.target.value)}
                  placeholder="Enter emails separated by commas or new lines"
                  rows={4}
                  className={cn(
                    'w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none transition-colors bg-white resize-none',
                    errors.recipientEmails ? '' : 'border-gray-200 focus:border-gray-400'
                  )}
                  style={errors.recipientEmails ? { borderColor: '#E61530' } : undefined}
                />
                <FieldError message={errors.recipientEmails} />
              </div>
            </>
          )}

          {/* Valid From */}
          <div>
            <FieldLabel required>Valid From</FieldLabel>
            <DatePickerInput
              value={form.validFrom}
              onChange={(v) => patch('validFrom', v)}
              placeholder="Select start date"
            />
            <FieldError message={errors.validFrom} />
          </div>

          {/* End Date — reference only, not sent to the API (no such field exists on the backend) */}
          <div>
            <FieldLabel>End Date <span className="font-normal text-gray-400">(reference only — not enforced by the API)</span></FieldLabel>
            <DatePickerInput
              value={form.endDate}
              onChange={(v) => patch('endDate', v)}
              placeholder="Select end date"
              fromDate={form.validFrom ? new Date(form.validFrom) : undefined}
            />
          </div>

          {/* Advanced Settings */}
          <div>
            <p className="text-[13px] font-semibold text-gray-800 mb-3">
              Advanced Settings{' '}
              <span className="font-normal text-gray-400">(Optional)</span>
            </p>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck
                    size={16}
                    className="text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-800">
                    First-time users only
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Restrict this discount to new attendees
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={form.forFirstTimersOnly}
                onChange={(v) => patch('forFirstTimersOnly', v)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-6 py-[10px] rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-[10px] rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            {isPending ? 'Creating…' : 'Create Discount'}
          </button>
        </div>
      </div>
    </div>
  );
}
