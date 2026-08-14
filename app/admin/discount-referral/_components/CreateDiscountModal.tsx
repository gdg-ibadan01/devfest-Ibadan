'use client';

import { useState } from 'react';
import { X, Check, ChevronDown, Calendar, ShieldCheck, XCircle } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type {
  CreateDiscountForm,
  DiscountType,
  AppliesTo,
  UsageLimitType,
} from '../_types/discount.types';

const DECLARATION_DATE_OPTIONS = [
  { value: 'friday', label: 'Friday Pass' },
  { value: 'saturday', label: 'Saturday Pass' },
  { value: 'vip', label: 'VIP' },
  { value: 'full', label: 'Full Access' },
];

const INITIAL_FORM: CreateDiscountForm = {
  name: '',
  code: '',
  discountType: 'percentage',
  value: '',
  appliesTo: 'all',
  declarationDates: [],
  usageLimit: 'unlimited',
  users: '',
  startDate: '',
  endDate: '',
  firstTimeOnly: true,
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-medium text-gray-800 mb-2">{children}</p>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-md px-4 py-3 border-gray-200 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-transparent"
    />
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

/* Multi-select chip (Declaration Date) */
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

/* Split value input (prefix + number) */
function ValueInput({
  prefix,
  value,
  onChange,
}: {
  prefix: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition-colors bg-white">
      <span className="px-4 py-3 text-[13px] text-gray-500 border-r border-gray-200 bg-gray-50 whitespace-nowrap select-none">
        {prefix}
      </span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="flex-1 px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none bg-transparent"
      />
    </div>
  );
}

/* Date input with calendar icon */
function DateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition-colors bg-white">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="DD/MM/YYYY"
        className="flex-1 px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none bg-transparent"
      />
      <span className="pr-4 text-gray-400">
        <Calendar size={16} />
      </span>
    </div>
  );
}

/* Usage Limit dropdown */
function UsageLimitSelect({
  value,
  onChange,
}: {
  value: UsageLimitType;
  onChange: (v: UsageLimitType) => void;
}) {
  const [open, setOpen] = useState(false);
  const options: { value: UsageLimitType; label: string }[] = [
    { value: 'unlimited', label: 'Unlimited' },
    { value: 'limited', label: 'Limited' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-600 bg-white hover:border-gray-300 transition-colors focus:outline-none"
      >
        <span className={value ? 'text-gray-800' : 'text-gray-300'}>
          {options.find((o) => o.value === value)?.label ?? 'Select'}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-gray-400 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-3 text-[13px] hover:bg-gray-50 transition-colors',
                value === opt.value
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
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



interface CreateDiscountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDiscountForm) => void;
}

export default function CreateDiscountModal({
  open,
  onClose,
  onSubmit,
}: CreateDiscountModalProps) {
  const [form, setForm] = useState<CreateDiscountForm>(INITIAL_FORM);

  const patch = <K extends keyof CreateDiscountForm>(
    key: K,
    value: CreateDiscountForm[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const toggleDeclarationDate = (value: string) => {
    setForm((f) => ({
      ...f,
      declarationDates: f.declarationDates.includes(value)
        ? f.declarationDates.filter((d) => d !== value)
        : [...f.declarationDates, value],
    }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(form);
    handleClose();
  };

  if (!open) return null;

  const valuePrefix =
    form.discountType === 'percentage' ? 'Percentage (%)' : 'NGN (Naira)';
  const valueSectionLabel =
    form.discountType === 'percentage' ? 'Percentage' : 'Value';

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
            <FieldLabel>Discount Name</FieldLabel>
            <TextInput
              placeholder="Input Discount Name"
              value={form.name}
              onChange={(v) => patch('name', v)}
            />
          </div>

          {/* Discount Code */}
          <div>
            <FieldLabel>Discount Code</FieldLabel>
            <TextInput
              placeholder="Input Discount Code"
              value={form.code}
              onChange={(v) => patch('code', v)}
            />
          </div>

          {/* Discount Type */}
          <div>
            <FieldLabel>Discount Type</FieldLabel>
            <div className="flex gap-3">
              <RadioToggle
                label="Percentage (%)"
                selected={form.discountType === 'percentage'}
                onSelect={() => patch('discountType', 'percentage')}
              />
              <RadioToggle
                label="Fixed Amount (₦)"
                selected={form.discountType === 'fixed'}
                onSelect={() => patch('discountType', 'fixed')}
              />
            </div>
          </div>

          {/* Value */}
          <div>
            <FieldLabel>{valueSectionLabel}</FieldLabel>
            <ValueInput
              prefix={valuePrefix}
              value={form.value}
              onChange={(v) => patch('value', v)}
            />
          </div>

          {/* Does it Apply to */}
          <div>
            <FieldLabel>Does it Apply to</FieldLabel>
            <div className="flex gap-3">
              <RadioToggle
                label="All Ticket"
                selected={form.appliesTo === 'all'}
                onSelect={() => patch('appliesTo', 'all')}
              />
              <RadioToggle
                label="Selected Ticket"
                selected={form.appliesTo === 'selected'}
                onSelect={() => patch('appliesTo', 'selected')}
              />
            </div>
          </div>

          {/* Declaration Date — only when Selected Ticket */}
          {form.appliesTo === 'selected' && (
            <div>
              <FieldLabel>Declaration Date</FieldLabel>
              <div className="flex gap-3 flex-wrap">
                {DECLARATION_DATE_OPTIONS.map((opt) => (
                  <MultiChip
                    key={opt.value}
                    label={opt.label}
                    selected={form.declarationDates.includes(opt.value)}
                    onToggle={() => toggleDeclarationDate(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Usage Limit */}
          <div>
            <FieldLabel>Usage Limit</FieldLabel>
            <UsageLimitSelect
              value={form.usageLimit}
              onChange={(v) => patch('usageLimit', v)}
            />
          </div>

          {/* Users — only when Limited */}
          {form.usageLimit === 'limited' && (
            <div>
              <FieldLabel>Users</FieldLabel>
              <input
                type="number"
                min="1"
                value={form.users}
                onChange={(e) => patch('users', e.target.value)}
                placeholder="How many users"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>
          )}

          {/* Validity Start Date */}
          <div>
            <FieldLabel>Validity Start Date</FieldLabel>
            <DateInput
              value={form.startDate}
              onChange={(v) => patch('startDate', v)}
            />
          </div>

          {/* Validity End Date */}
          <div>
            <FieldLabel>Validity End Date</FieldLabel>
            <DateInput
              value={form.endDate}
              onChange={(v) => patch('endDate', v)}
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
                checked={form.firstTimeOnly}
                onChange={(v) => patch('firstTimeOnly', v)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-[10px] rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-[10px] rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition-colors"
          >
            Create Discount
          </button>
        </div>
      </div>
    </div>
  );
}