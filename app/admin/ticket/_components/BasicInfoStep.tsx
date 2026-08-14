'use client';

import type { TicketBasicInfo } from '../_types/ticket.types';
import {
  TextInput,
  TextArea,
  DeclarationDatePicker,
  FormActions,
} from './FormControls';

const DECLARATION_OPTIONS = [
  { value: 'friday', label: 'Friday', sub: 'Workshop' },
  { value: 'saturday', label: 'Saturday', sub: 'Main Event' },
  { value: 'both', label: 'Friday & Saturday' },
];

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
  const set = <K extends keyof TicketBasicInfo>(key: K, value: TicketBasicInfo[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <h2 className="text-[18px] font-bold text-black mb-6">Basic Info</h2>

      <div className="flex flex-col gap-5">
        <TextInput
          label="Ticket Name"
          id="ticketName"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Input Ticket Name"
        />

        <TextArea
          label="Description"
          id="description"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What's included with this ticket?"
        />

        <DeclarationDatePicker
          label="Declaration Date"
          value={data.declarationDate}
          onChange={(val) => set('declarationDate', val as TicketBasicInfo['declarationDate'])}
          options={DECLARATION_OPTIONS}
        />
      </div>

      <div className="mt-8">
        <FormActions
          onCancel={onCancel}
          onNext={onNext}
          nextLabel="Proceed to Pricing"
        />
      </div>
    </div>
  );
}
