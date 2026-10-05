'use client';

import { X } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import type { ReactNode } from 'react';
import { cn } from '@/app/_module/lib/utils';
import type { OrderListItemDto } from '@/app/_module/api/types';
import type { OrderStatus } from '../_types/order.types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PAID: 'Paid',
  AWAITING_PAYMENT: 'Awaiting Payment',
  CANCELLED: 'Cancelled',
  AWAITING_REFUND: 'Awaiting Refund',
  REFUNDED: 'Refunded',
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { dot: string; text: string; bg: string }
> = {
  PAID: { dot: 'bg-[#34A853]', text: 'text-[#1B873B]', bg: 'bg-[#E8F5E9]' },
  AWAITING_PAYMENT: {
    dot: 'bg-[#F59E0B]',
    text: 'text-[#92400E]',
    bg: 'bg-[#FEF3C7]',
  },
  CANCELLED: {
    dot: 'bg-[#EA4335]',
    text: 'text-[#C5221F]',
    bg: 'bg-[#FDECEA]',
  },
  AWAITING_REFUND: {
    dot: 'bg-[#F59E0B]',
    text: 'text-[#92400E]',
    bg: 'bg-[#FEF3C7]',
  },
  REFUNDED: { dot: 'bg-[#9AA0A6]', text: 'text-[#5F6368]', bg: 'bg-[#F1F3F4]' },
};

function formatDateSafe(iso?: string | null): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'dd MMM yyyy, h:mm a') : iso;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.AWAITING_PAYMENT;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium whitespace-nowrap',
        cfg.bg,
        cfg.text
      )}
    >
      <span
        className={cn('w-[7px] h-[7px] rounded-full flex-shrink-0', cfg.dot)}
      />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className="text-[13px] font-medium text-gray-800 text-right">
        {value}
      </span>
    </div>
  );
}

interface OrderDetailsModalProps {
  order: OrderListItemDto | null;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const checkedIn = order.checkIns.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[17px] font-bold text-gray-900">
            Order Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-600 p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <DetailRow label="Order ID" value={order.id} />
          <DetailRow label="Attendee Name" value={order.attendeeFullName} />
          <DetailRow label="Attendee Email" value={order.attendeeEmail} />
          <DetailRow label="Ticket" value={order.ticket?.name ?? '—'} />
          <DetailRow label="Ticket Code" value={order.ticket?.code ?? '—'} />
          <DetailRow label="Validity" value={order.ticket?.validity ?? '—'} />
          <DetailRow
            label="Amount"
            value={
              order.amount
                ? `₦${parseFloat(order.amount).toLocaleString('en-NG')}`
                : '—'
            }
          />
          <DetailRow
            label="Payment Status"
            value={<StatusBadge status={order.status as OrderStatus} />}
          />
          <DetailRow label="Paid At" value={formatDateSafe(order.paidAt)} />
          <DetailRow
            label="Check-in Status"
            value={
              checkedIn ? (
                <span className="text-[#1B873B]">
                  Checked in — {formatDateSafe(order.checkIns[order.checkIns.length - 1])}
                </span>
              ) : (
                <span className="text-gray-400">Not checked in</span>
              )
            }
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
