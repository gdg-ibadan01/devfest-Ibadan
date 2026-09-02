'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import type { TicketPricing } from '../_types/ticket.types';
import { CurrencyInput, ToggleRow, FormActions } from './FormControls';

interface Errors {
  price?: string;
  discount?: string;
}

interface PricingStepProps {
  data: TicketPricing;
  onChange: (data: TicketPricing) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export default function PricingStep({
  data,
  onChange,
  onCancel,
  onBack,
  onNext,
}: PricingStepProps) {
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof TicketPricing>(key: K, value: TicketPricing[K]) => {
    onChange({ ...data, [key]: value });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    const price = parseFloat(data.price);
    if (!data.price || isNaN(price) || price <= 0) {
      e.price = 'Price must be greater than 0.';
    }
    if (data.discount) {
      const discount = parseFloat(data.discount);
      if (isNaN(discount) || discount < 0) {
        e.discount = 'Discount must be a positive number.';
      } else if (!isNaN(price) && discount >= price) {
        e.discount = 'Discount must be less than the price.';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="py-[24px] px-[32px] bg-[#FAFAFA]">
        <h2 className="text-[18px] font-bold text-black">Pricing</h2>
      </div>

      <div className="flex flex-col gap-5 py-[24px] px-[32px]">
        <CurrencyInput
          label="Price"
          id="price"
          required
          value={data.price}
          onChange={(val) => set('price', val)}
          error={errors.price}
        />

        <CurrencyInput
          label="Discount"
          id="discount"
          value={data.discount}
          onChange={(val) => set('discount', val)}
          error={errors.discount}
          placeholder="0.00 (optional)"
        />

        <ToggleRow
          icon={<Clock size={20} />}
          label="Early bird pricing"
          description="Offer a discounted price for early buyers"
          checked={data.earlyBird}
          onChange={(val) => set('earlyBird', val)}
        />
      </div>

      <div className="p-[30px] border-t border-[#E6E6E6]">
        <FormActions
          onBack={onBack}
          onCancel={onCancel}
          onNext={handleNext}
          nextLabel="Proceed to Settings"
        />
      </div>
    </div>
  );
}
