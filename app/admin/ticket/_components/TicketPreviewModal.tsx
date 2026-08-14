'use client';

import { X, XCircle } from 'lucide-react';
import type { TicketFormData } from '../_types/ticket.types';

const LABEL_DATE_MAP: Record<string, string> = {
  friday: 'Friday',
  saturday: 'Saturday',
  both: 'Friday, Saturday',
};

interface PreviewSectionProps {
  title: string;
  children: React.ReactNode;
}

const SeparatorLine = () => {
  return <div className="bg-[#E4E7EC] w-full h-[0.5px]"></div>;
};

function PreviewSection({ title, children }: PreviewSectionProps) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl p-5">
      <h3 className="text-[16px] font-bold text-black mb-5">{title}</h3>
      {children}
    </div>
  );
}

interface PreviewFieldProps {
  label: string;
  value: string;
  wide?: boolean;
}

function PreviewField({ label, value, wide }: PreviewFieldProps) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p className="text-[14px] font-semibold text-black">{value || '—'}</p>
    </div>
  );
}

interface TicketPreviewModalProps {
  open: boolean;
  onClose: () => void;
  data: TicketFormData;
}

export default function TicketPreviewModal({
  open,
  onClose,
  data,
}: TicketPreviewModalProps) {
  if (!open) return null;

  const { basicInfo, pricing, advancedSettings } = data;

  const declarationLabel = LABEL_DATE_MAP[basicInfo.declarationDate] ?? '—';
  const validityLabel = LABEL_DATE_MAP[advancedSettings.validity] ?? '—';

  const dayLabel =
    basicInfo.declarationDate === 'friday'
      ? 'Friday (workshop)'
      : basicInfo.declarationDate === 'saturday'
        ? 'Saturday (Main Event)'
        : 'Friday & Saturday';

  const formatDate = (d: string) => {
    if (!d) return '—';
    const [year, month, day] = d.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatAmount = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '—';
    return `₦${num.toLocaleString('en-NG')}`;
  };

  const discountDisplay = () => {
    const num = parseFloat(pricing.discount);
    if (isNaN(num) || num === 0) return '—';
    const price = parseFloat(pricing.price);
    if (!isNaN(price) && price > 0) {
      return `${Math.round((num / price) * 100)}%`;
    }
    return formatAmount(pricing.discount);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col rounded-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200">
          <h2 className="text-[18px] font-bold text-black">Ticket Preview</h2>
          <button
            onClick={onClose}
            className="rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <XCircle size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
          {/* Basic Info */}
          <PreviewSection title="Basic Info">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <PreviewField label="Ticket Name" value={basicInfo.name || '—'} />
              <PreviewField label="Declaration Date" value={declarationLabel} />
              <PreviewField
                label="Description"
                value={basicInfo.description || '—'}
                wide
              />
            </div>
          </PreviewSection>
          <SeparatorLine />
          {/* Pricing */}
          <PreviewSection title="Pricing">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <PreviewField label="Day" value={dayLabel} />
              <PreviewField label="Price" value={formatAmount(pricing.price)} />
              <PreviewField label="Discount" value={discountDisplay()} />
              <PreviewField
                label="Early Bird Discount"
                value={pricing.earlyBird ? 'Yes' : 'No'}
              />
            </div>
          </PreviewSection>
          <SeparatorLine />
          {/* Advanced Settings */}
          <PreviewSection title="Advanced Settings">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <PreviewField label="Ticket Validity" value={validityLabel} />
              <PreviewField
                label="Quantity Limit"
                value={
                  advancedSettings.quantityLimit
                    ? Number(advancedSettings.quantityLimit).toLocaleString()
                    : 'Unlimited'
                }
              />
              <PreviewField
                label="Start Date"
                value={formatDate(advancedSettings.startDate)}
              />
              <PreviewField
                label="End Date"
                value={formatDate(advancedSettings.endDate)}
              />
            </div>
          </PreviewSection>
        </div>
      </div>
    </>
  );
}
