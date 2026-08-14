'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CreateTicketStepper from '../_components/CreateTicketStepper';
import BasicInfoStep from '../_components/BasicInfoStep';
import PricingStep from '../_components/PricingStep';
import AdvancedSettingsStep from '../_components/AdvancedSettingsStep';
import type {
  CreateTicketStep,
  TicketFormData,
} from '../_types/ticket.types';

const INITIAL_FORM: TicketFormData = {
  basicInfo: {
    name: '',
    description: '',
    declarationDate: 'friday',
  },
  pricing: {
    price: '',
    discount: '',
    earlyBird: false,
  },
  advancedSettings: {
    validity: 'friday',
    quantityLimit: '',
    startDate: '',
    endDate: '',
  },
};

export default function CreateTicketPage() {
  const router = useRouter();
  const [step, setStep] = useState<CreateTicketStep>('basicInfo');
  const [form, setForm] = useState<TicketFormData>(INITIAL_FORM);

  const handleCancel = () => router.push('/admin/tickets');

  const handleSubmit = () => {
    // TODO: wire up API call here
    toast.success('Ticket created successfully!');
    router.push('/admin/tickets');
  };

  return (
    <div className="px-8 py-8 max-w-[780px] mx-auto">
      {/* Stepper */}
      <div className="mb-6">
        <CreateTicketStepper currentStep={step} />
      </div>

      {/* Step content */}
      {step === 'basicInfo' && (
        <BasicInfoStep
          data={form.basicInfo}
          onChange={(basicInfo) => setForm((prev) => ({ ...prev, basicInfo }))}
          onCancel={handleCancel}
          onNext={() => setStep('pricing')}
        />
      )}

      {step === 'pricing' && (
        <PricingStep
          data={form.pricing}
          onChange={(pricing) => setForm((prev) => ({ ...prev, pricing }))}
          onCancel={handleCancel}
          onNext={() => setStep('advancedSettings')}
        />
      )}

      {step === 'advancedSettings' && (
        <AdvancedSettingsStep
          data={form.advancedSettings}
          onChange={(advancedSettings) =>
            setForm((prev) => ({ ...prev, advancedSettings }))
          }
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
