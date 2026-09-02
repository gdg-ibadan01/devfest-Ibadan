'use client';

import { format, isValid, parseISO } from 'date-fns';
import { XCircle } from 'lucide-react';
import { useTicket } from '@/app/_module/services';
import type { GetTicketResponseDto } from '@/app/_module/api/types';
import { Fragment } from 'react';

//Helpers Functions

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

//Layout primitives

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

//Skeleton Loader

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className ?? ''}`} />
  );
}

function SkeletonSection({ rows = 2 }: { rows?: number }) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl p-5">
      <SkeletonBlock className="h-4 w-32 mb-5" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <div key={i}>
            <SkeletonBlock className="h-2.5 w-16 mb-2" />
            <SkeletonBlock className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

//Ticket details content

function TicketDetails({ ticket }: { ticket: GetTicketResponseDto }) {
  const discountNum = parseFloat(ticket.discount);
  const priceNum = parseFloat(ticket.price);
  const discountPct =
    !isNaN(discountNum) && discountNum > 0 && !isNaN(priceNum) && priceNum > 0
      ? `${Math.round((discountNum / priceNum) * 100)}%`
      : '—';

  return (
    <Fragment>
      {/* Ticket Info */}
      <PreviewSection title="Basic Info">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <PreviewField label="Ticket Name" value={ticket.name} />
          <PreviewField
            label="Declaration Date"
            value={
              ticket.eventDates?.map((date) => formatDate(date)).join(', ') ||
              '—'
            }
          />
          <PreviewField label="Description" value={ticket.description} wide />
        </div>
      </PreviewSection>

      <SeparatorLine />

      {/* Event Dates */}
      <PreviewSection title="Pricing">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <PreviewField
            label="Day"
            value={
              ticket.eventDates?.map((date) => formatDate(date)).join(', ') ||
              '—'
            }
          />
          <PreviewField label="Price" value={formatAmount(ticket.price)} />
          <PreviewField
            label="Discount"
            value={
              parseFloat(ticket.discount) > 0
                ? formatAmount(ticket.discount)
                : '—'
            }
          />
          <PreviewField label="Discount %" value={discountPct} />
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
            label="Ticket Validity"
            value={
              ticket.validityDates
                ?.map((date) => formatDate(date))
                .join(', ') || '—'
            }
          />
          <PreviewField
            label="Quantity Limit"
            value={(ticket.capacity ?? 0).toLocaleString()}
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

      {/* Creator */}
      {ticket.creator && (
        <>
          <SeparatorLine />
          <PreviewSection title="Creator">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <PreviewField label="Name" value={ticket.creator.name} />
              <PreviewField label="Role" value={ticket.creator.role} />
            </div>
          </PreviewSection>
        </>
      )}
    </Fragment>
  );
}

// Preview Modal

interface TicketPreviewModalProps {
  open: boolean;
  onClose: () => void;
  ticketId: string;
}

export default function TicketPreviewModal({
  open,
  onClose,
  ticketId,
}: TicketPreviewModalProps) {
  const { data: ticket, isLoading, isError } = useTicket(ticketId);

  if (!open) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col rounded-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 flex-shrink-0">
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
          {isLoading ? (
            <>
              <SkeletonSection rows={3} />
              <SeparatorLine />
              <SkeletonSection rows={2} />
              <SeparatorLine />
              <SkeletonSection rows={1} />
            </>
          ) : isError || !ticket ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <p className="text-[13px] text-gray-400">
                Failed to load ticket details.
              </p>
            </div>
          ) : (
            <TicketDetails ticket={ticket} />
          )}
        </div>
      </div>
    </Fragment>
  );
}
