'use client';

import { format, isValid, parseISO } from 'date-fns';
import { XCircle } from 'lucide-react';
import type { TicketListItemDto } from '@/app/_module/api/types';

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'dd MMM yyyy') : iso;
}

function formatAmount(val: string | number): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '—';
  return `₦${num.toLocaleString('en-NG')}`;
}

const SeparatorLine = () => <div className="bg-[#E4E7EC] w-full h-[0.5px]" />;

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl p-5">
      <h3 className="text-[16px] font-bold text-black mb-5">{title}</h3>
      {children}
    </div>
  );
}

function PreviewField({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
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
  ticket: TicketListItemDto;
}

export default function TicketPreviewModal({
  open,
  onClose,
  ticket,
}: TicketPreviewModalProps) {
  if (!open) return null;

  const discountNum = parseFloat(ticket.discount);
  const priceNum = parseFloat(ticket.price);
  const discountPct =
    !isNaN(discountNum) && discountNum > 0 && !isNaN(priceNum) && priceNum > 0
      ? `${Math.round((discountNum / priceNum) * 100)}%`
      : '—';

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col rounded-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200">
          <h2 className="text-[18px] font-bold text-black">Ticket Preview</h2>
          <button
            onClick={onClose}
            className="rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors p-1"
          >
            <XCircle size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
          {/* Ticket Info */}
          <PreviewSection title="Basic Info">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <PreviewField label="Ticket Name" value={ticket.name} />
              <PreviewField
                label="Declaration Date"
                value={ticket.eventDates
                  ?.map((date) => formatDate(date))
                  .join(', ')}
              />
              <PreviewField
                label="Description"
                value={ticket?.name ?? ''}
                wide
              />
            </div>
          </PreviewSection>

          <SeparatorLine />

          {/* Event Dates */}
          <PreviewSection title="Pricing">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <PreviewField
                label="Day"
                value={ticket.eventDates
                  ?.map((date) => formatDate(date))
                  .join(', ')}
              />
              <PreviewField label="Price" value={formatAmount(ticket.price)} />
              <PreviewField label="Discount" value={discountPct} />
              <PreviewField
                label="Early Bird Discount"
                value={ticket?.discount ? 'Yes' : 'No'}
              />
            </div>
          </PreviewSection>

          <SeparatorLine />

          {/* Sale Period */}
          <PreviewSection title="Advanced Settings">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <PreviewField
                label="Ticket Validaity"
                value={ticket.validityDates
                  ?.map((date) => formatDate(date))
                  .join(', ')}
              />
              <PreviewField
                label="Quantity Limit"
                value={ticket.capacity?.toString() || '—'}
              />
              <PreviewField
                label="Sale Starts"
                value={formatDate(ticket.saleStartsAt)}
              />
              <PreviewField
                label="Sale Ends"
                value={formatDate(ticket.saleEndsAt)}
              />
            </div>
          </PreviewSection>
        </div>
      </div>
    </>
  );
}
