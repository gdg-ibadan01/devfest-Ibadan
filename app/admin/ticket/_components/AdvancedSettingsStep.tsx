'use client';

import InputCalendar from '@/app/_module/components/icons/InputCalendar';
import type { TicketAdvancedSettings } from '../_types/ticket.types';
import {
  TextInput,
  DeclarationDatePicker,
  FieldLabel,
  FormActions,
} from './FormControls';

const VALIDITY_OPTIONS = [
  { value: 'friday', label: 'Friday', sub: 'Workshop' },
  { value: 'saturday', label: 'Saturday', sub: 'Main Event' },
  { value: 'both', label: 'Friday & Saturday' },
];

interface AdvancedSettingsStepProps {
  data: TicketAdvancedSettings;
  onChange: (data: TicketAdvancedSettings) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function AdvancedSettingsStep({
  data,
  onChange,
  onCancel,
  onSubmit,
}: AdvancedSettingsStepProps) {
  const set = <K extends keyof TicketAdvancedSettings>(
    key: K,
    value: TicketAdvancedSettings[K]
  ) => onChange({ ...data, [key]: value });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="py-[24px] px-[32px] bg-[#FAFAFA]">
        <h2 className="text-[18px] font-bold text-black">Advanced Settings</h2>
      </div>

      <div className="flex flex-col gap-5 py-[24px] px-[32px]">
        <DeclarationDatePicker
          label="Ticket Validity"
          value={data.validity}
          onChange={(val) =>
            set('validity', val as TicketAdvancedSettings['validity'])
          }
          options={VALIDITY_OPTIONS}
        />

        <TextInput
          label="Quantity Limit"
          id="quantityLimit"
          type="number"
          min="0"
          value={data.quantityLimit}
          onChange={(e) => set('quantityLimit', e.target.value)}
          placeholder="e.g 300 (leave blank if unlimited)"
        />

        {/* Sale Start Date */}
        <div>
          <FieldLabel htmlFor="startDate">Sale Start Date</FieldLabel>
          <div className="relative">
            <input
              id="startDate"
              type="date"
              value={data.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors bg-white appearance-none"
              placeholder="DD/MM/YYYY"
            />
            {/* <InputCalendar /> */}
          </div>
        </div>

        {/* Sale End Date */}
        <div>
          <FieldLabel htmlFor="endDate">Sale End Date</FieldLabel>
          <div className="relative">
            <input
              id="endDate"
              type="date"
              value={data.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors bg-white appearance-none"
              placeholder="DD/MM/YYYY"
            />
            {/* <InputCalendar /> */}
          </div>
        </div>
      </div>

      <div className="p-[30px] border-t border-[#E6E6E6]">
        <FormActions onCancel={onCancel} onNext={onSubmit} nextLabel="Submit" />
      </div>
    </div>
  );
}
