'use client';

import React from 'react';

type OrderStatus =
  'AWAITING_PAYMENT' | 'PAID' | 'CANCELLED' | 'AWAITING_REFUND' | 'REFUNDED';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; colour: string; bg: string }
> = {
  PAID: { label: 'Paid', colour: '#16a34a', bg: '#dcfce7' },
  AWAITING_PAYMENT: {
    label: 'Awaiting Payment',
    colour: '#d97706',
    bg: '#fef3c7',
  },
  CANCELLED: { label: 'Cancelled', colour: '#dc2626', bg: '#fee2e2' },
  AWAITING_REFUND: {
    label: 'Awaiting Refund',
    colour: '#7c3aed',
    bg: '#ede9fe',
  },
  REFUNDED: { label: 'Refunded', colour: '#0284c7', bg: '#e0f2fe' },
};

export default function StatusBadge({ status }: Readonly<{ status: string }>) {
  const cfg = STATUS_CONFIG[status as OrderStatus] ?? {
    label: status,
    colour: '#6b7280',
    bg: '#f3f4f6',
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-4 py-1 rounded-xl text-xs font-semibold"
      style={{ color: cfg.colour, backgroundColor: cfg.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: cfg.colour }}
      />
      {cfg.label}
    </span>
  );
}
