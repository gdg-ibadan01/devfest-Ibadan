'use client';

import { useState } from 'react';
import type { TicketBasicInfo } from '../_types/ticket.types';
import {
  TextInput,
  TextArea,
  DeclarationDatePicker,
  DatePickerInput,
  FieldLabel,
  FieldError,
  FormActions,
} from './FormControls';

const DECLARATION_OPTIONS = [
  { value: 'friday', label: 'Friday', sub: 'Workshop' },
  { value: 'saturday', label: 'Saturday', sub: 'Main Event' },
  { value: 'both', label: 'Friday & Saturday' },
];

interface Errors {
  name?: string;
  description?: string;
  fridayDate?: string;
  saturdayDate?: string;
}

interface BasicInfoStepProps {
  data: TicketBasicInfo;
  onChange: (data: TicketBasicInfo) => void;
  onCancel: () => void;
  onNext: () => void;
}

export default function BasicInfoStep({
  data,
  onChange,
  onCancel,
  onNext,
}: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof TicketBasicInfo>(key: K, value: TicketBasicInfo[K]) => {
    onChange({ ...data, [key]: value });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = 'Ticket name is required.';
    if (!data.description.trim()) e.description = 'Description is required.';
    if (data.declarationDate === 'friday' || data.declarationDate === 'both') {
      if (!data.fridayDate) e.fridayDate = 'Friday event date is required.';
    }
    if (data.declarationDate === 'saturday' || data.declarationDate === 'both') {
      if (!data.saturdayDate) e.saturdayDate = 'Saturday event date is required.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const needsFriday = data.declarationDate === 'friday' || data.declarationDate === 'both';
  const needsSaturday = data.declarationDate === 'saturday' || data.declarationDate === 'both';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="py-[24px] px-[32px] bg-[#FAFAFA]">
        <h2 className="text-[18px] font-bold text-black">Basic Info</h2>
      </div>
      <div className="flex flex-col gap-5 py-[24px] px-[32px]">
        <TextInput
          label="Ticket Name"
          id="ticketName"
          required
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Input Ticket Name"
          error={errors.name}
        />

        <TextArea
          label="Description"
          id="description"
          required
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What's included with this ticket?"
          error={errors.description}
        />

        <DeclarationDatePicker
          label="Declaration Date"
          required
          value={data.declarationDate}
          onChange={(val) => {
            set('declarationDate', val as TicketBasicInfo['declarationDate']);
            setErrors({});
          }}
          options={DECLARATION_OPTIONS}
        />

        {/* Actual date inputs shown based on selection */}
        {needsFriday && (
          <div>
            <FieldLabel required>Friday Event Date</FieldLabel>
            <DatePickerInput
              value={data.fridayDate}
              onChange={(val) => { onChange({ ...data, fridayDate: val }); setErrors((p) => ({ ...p, fridayDate: undefined })); }}
              placeholder="Pick Friday event date"
            />
            <FieldError message={errors.fridayDate} />
          </div>
        )}

        {needsSaturday && (
          <div>
            <FieldLabel required>Saturday Event Date</FieldLabel>
            <DatePickerInput
              value={data.saturdayDate}
              onChange={(val) => { onChange({ ...data, saturdayDate: val }); setErrors((p) => ({ ...p, saturdayDate: undefined })); }}
              placeholder="Pick Saturday event date"
            />
            <FieldError message={errors.saturdayDate} />
          </div>
        )}
      </div>

      <div className="p-[30px] border-t border-[#E6E6E6]">
        <FormActions
          onCancel={onCancel}
          onNext={handleNext}
          nextLabel="Proceed to Pricing"
        />
      </div>
    </div>
  );
}
