'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateTicketStepper from '../_components/CreateTicketStepper';
import BasicInfoStep from '../_components/BasicInfoStep';
import PricingStep from '../_components/PricingStep';
import AdvancedSettingsStep from '../_components/AdvancedSettingsStep';
import type { CreateTicketStep, TicketFormData } from '../_types/ticket.types';
import { buildEventDates, buildValidityDates } from '../_types/ticket.types';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import { useCreateTicket } from '@/app/_module/services';

const INITIAL_FORM: TicketFormData = {
  basicInfo: {
    name: '',
    description: '',
    declarationDate: 'friday',
    fridayDate: '',
    saturdayDate: '',
  },
  pricing: {
    price: '',
    discount: '',
    earlyBird: false,
  },
  advancedSettings: {
    validity: 'friday',
    fridayValidityDate: '',
    saturdayValidityDate: '',
    quantityLimit: '',
    capacity: '',
    startDate: '',
    endDate: '',
  },
};

export default function CreateTicketPage() {
  const router = useRouter();
  const [step, setStep] = useState<CreateTicketStep>('basicInfo');
  const [form, setForm] = useState<TicketFormData>(INITIAL_FORM);

  const { mutate: createTicket, isPending } = useCreateTicket();

  const handleCancel = () => router.push('/admin/ticket');

  const handleSubmit = () => {
    const { basicInfo, pricing, advancedSettings } = form;

    createTicket(
      {
        name: basicInfo.name.trim(),
        description: basicInfo.description.trim(),
        eventDates: buildEventDates(basicInfo),
        price: parseFloat(pricing.price),
        discount: pricing.discount ? parseFloat(pricing.discount) : 0,
        validityDates: buildValidityDates(advancedSettings),
        //maximumSaleUnits was removed from schema — only capacity is sent
        capacity: parseInt(advancedSettings.capacity, 10) || 0,
        saleStartsAt: advancedSettings.startDate,
        saleEndsAt: advancedSettings.endDate,
      },
      {
        onSuccess: () => router.push('/admin/ticket'),
      }
    );
  };

  return (
    <AdminWrapper title="Ticket">
      <div className="lg:px-[32px] px-[20px] py-[24px] max-w-[780px] mx-auto">
        {/* Stepper */}
        <div className="mb-6">
          <CreateTicketStepper currentStep={step} />
        </div>

        {/* Step content */}
        {step === 'basicInfo' && (
          <BasicInfoStep
            data={form.basicInfo}
            onChange={(basicInfo) =>
              setForm((prev) => {
                // Auto-sync validity dates from event dates if not yet set
                const adv = { ...prev.advancedSettings };
                if (basicInfo.fridayDate && !adv.fridayValidityDate) {
                  adv.fridayValidityDate = basicInfo.fridayDate;
                }
                if (basicInfo.saturdayDate && !adv.saturdayValidityDate) {
                  adv.saturdayValidityDate = basicInfo.saturdayDate;
                }
                return { ...prev, basicInfo, advancedSettings: adv };
              })
            }
            onCancel={handleCancel}
            onNext={() => setStep('pricing')}
          />
        )}

        {step === 'pricing' && (
          <PricingStep
            data={form.pricing}
            onChange={(pricing) => setForm((prev) => ({ ...prev, pricing }))}
            onCancel={handleCancel}
            onBack={() => setStep('basicInfo')}
            onNext={() => setStep('advancedSettings')}
          />
        )}

        {step === 'advancedSettings' && (
          <AdvancedSettingsStep
            data={form.advancedSettings}
            onChange={(advancedSettings) => setForm((prev) => ({ ...prev, advancedSettings }))}
            onCancel={handleCancel}
            onBack={() => setStep('pricing')}
            onSubmit={handleSubmit}
            loading={isPending}
            eventDates={{
              fridayDate: form.basicInfo.fridayDate,
              saturdayDate: form.basicInfo.saturdayDate,
            }}
          />
        )}
      </div>
    </AdminWrapper>
  );
}
