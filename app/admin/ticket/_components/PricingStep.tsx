'use client';

import { Clock } from 'lucide-react';
import type { TicketPricing } from '../_types/ticket.types';
import { CurrencyInput, ToggleRow, FormActions } from './FormControls';

interface PricingStepProps {
  data: TicketPricing;
  onChange: (data: TicketPricing) => void;
  onCancel: () => void;
  onNext: () => void;
}

export default function PricingStep({
  data,
  onChange,
  onCancel,
  onNext,
}: PricingStepProps) {
  const set = <K extends keyof TicketPricing>(key: K, value: TicketPricing[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <h2 className="text-[18px] font-bold text-black mb-6">Pricing</h2>

      <div className="flex flex-col gap-5">
        <CurrencyInput
          label="Price"
          id="price"
          value={data.price}
          onChange={(val) => set('price', val)}
        />

        <CurrencyInput
          label="Discount"
          id="discount"
          value={data.discount}
          onChange={(val) => set('discount', val)}
        />

        <ToggleRow
          icon={<Clock size={20} />}
          label="Early bird pricing"
          description="Offer a discounted price for early buyers"
          checked={data.earlyBird}
          onChange={(val) => set('earlyBird', val)}
        />
      </div>

      <div className="mt-8">
        <FormActions
          onCancel={onCancel}
          onNext={onNext}
          nextLabel="Proceed to Settings"
        />
      </div>
    </div>
  );
}
