'use client';

import { useState } from 'react';
import { format, parseISO, isAfter, isValid } from 'date-fns';
import type { TicketAdvancedSettings } from '../_types/ticket.types';
import {
  NumberInput,
  DeclarationDatePicker,
  DatePickerInput,
  FieldLabel,
  FieldError,
  FormActions,
} from './FormControls';

function formatDateForError(iso: string): string {
  try {
    const d = parseISO(iso);
    return isValid(d) ? format(d, 'dd MMM yyyy') : iso;
  } catch {
    return iso;
  }
}

const VALIDITY_OPTIONS = [
  { value: 'friday', label: 'Friday', sub: 'Workshop' },
  { value: 'saturday', label: 'Saturday', sub: 'Main Event' },
  { value: 'both', label: 'Friday & Saturday' },
];

interface Errors {
  fridayValidityDate?: string;
  saturdayValidityDate?: string;
  quantityLimit?: string;
  capacity?: string;
  startDate?: string;
  endDate?: string;
}

interface AdvancedSettingsStepProps {
  data: TicketAdvancedSettings;
  onChange: (data: TicketAdvancedSettings) => void;
  onCancel: () => void;
  onBack: () => void;
  onSubmit: () => void;
  loading?: boolean;
  /** Event dates from step 1, used to constrain validity dates */
  eventDates?: { fridayDate: string; saturdayDate: string };
}

export default function AdvancedSettingsStep({
  data,
  onChange,
  onCancel,
  onBack,
  onSubmit,
  loading,
  eventDates,
}: AdvancedSettingsStepProps) {
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof TicketAdvancedSettings>(key: K, value: TicketAdvancedSettings[K]) => {
    onChange({ ...data, [key]: value });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    const needsFriday = data.validity === 'friday' || data.validity === 'both';
    const needsSaturday = data.validity === 'saturday' || data.validity === 'both';

    if (needsFriday && !data.fridayValidityDate) {
      e.fridayValidityDate = 'Friday validity date is required.';
    } else if (needsFriday && eventDates?.fridayDate && data.fridayValidityDate !== eventDates.fridayDate) {
      e.fridayValidityDate = `Validity date must match the event date (${formatDateForError(eventDates.fridayDate)}).`;
    }
    if (needsSaturday && !data.saturdayValidityDate) {
      e.saturdayValidityDate = 'Saturday validity date is required.';
    } else if (needsSaturday && eventDates?.saturdayDate && data.saturdayValidityDate !== eventDates.saturdayDate) {
      e.saturdayValidityDate = `Validity date must match the event date (${formatDateForError(eventDates.saturdayDate)}).`;
    }
    if (data.quantityLimit) {
      const qty = parseInt(data.quantityLimit, 10);
      if (isNaN(qty) || qty <= 0) e.quantityLimit = 'Quantity must be a positive number.';
    }
    if (data.capacity) {
      const cap = parseInt(data.capacity, 10);
      if (isNaN(cap) || cap <= 0) e.capacity = 'Capacity must be a positive number.';
    }
    if (!data.startDate) {
      e.startDate = 'Sale start date is required.';
    }
    if (!data.endDate) {
      e.endDate = 'Sale end date is required.';
    }
    if (data.startDate && data.endDate) {
      const start = parseISO(data.startDate);
      const end = parseISO(data.endDate);
      if (isValid(start) && isValid(end) && !isAfter(end, start)) {
        e.endDate = 'End date must be after start date.';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  const needsFriday = data.validity === 'friday' || data.validity === 'both';
  const needsSaturday = data.validity === 'saturday' || data.validity === 'both';

  const startDateObj = data.startDate && isValid(parseISO(data.startDate))
    ? parseISO(data.startDate)
    : undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="py-[24px] px-[32px] bg-[#FAFAFA]">
        <h2 className="text-[18px] font-bold text-black">Advanced Settings</h2>
      </div>

      <div className="flex flex-col gap-5 py-[24px] px-[32px]">
        {/* Ticket Validity — which days is the ticket valid for */}
        <DeclarationDatePicker
          label="Ticket Validity"
          required
          value={data.validity}
          onChange={(val) => {
            set('validity', val as TicketAdvancedSettings['validity']);
            setErrors({});
          }}
          options={VALIDITY_OPTIONS}
        />

        {needsFriday && (
          <div>
            <FieldLabel required>Friday Validity Date</FieldLabel>
            <DatePickerInput
              value={data.fridayValidityDate}
              onChange={(val) => {
                onChange({ ...data, fridayValidityDate: val });
                setErrors((p) => ({ ...p, fridayValidityDate: undefined }));
              }}
              placeholder="Pick Friday validity date"
            />
            {eventDates?.fridayDate && (
              <p className="mt-1 text-[11px] text-gray-400">
                Must match the event date: <strong>{(() => { try { return format(parseISO(eventDates.fridayDate), 'dd MMM yyyy'); } catch { return eventDates.fridayDate; } })()}</strong>
              </p>
            )}
            <FieldError message={errors.fridayValidityDate} />
          </div>
        )}

        {needsSaturday && (
          <div>
            <FieldLabel required>Saturday Validity Date</FieldLabel>
            <DatePickerInput
              value={data.saturdayValidityDate}
              onChange={(val) => {
                onChange({ ...data, saturdayValidityDate: val });
                setErrors((p) => ({ ...p, saturdayValidityDate: undefined }));
              }}
              placeholder="Pick Saturday validity date"
            />
            {eventDates?.saturdayDate && (
              <p className="mt-1 text-[11px] text-gray-400">
                Must match the event date: <strong>{(() => { try { return format(parseISO(eventDates.saturdayDate), 'dd MMM yyyy'); } catch { return eventDates.saturdayDate; } })()}</strong>
              </p>
            )}
            <FieldError message={errors.saturdayValidityDate} />
          </div>
        )}

        <NumberInput
          label="Quantity Limit"
          id="quantityLimit"
          value={data.quantityLimit}
          onChange={(raw) => set('quantityLimit', raw)}
          placeholder="e.g. 300 (leave blank for unlimited)"
          error={errors.quantityLimit}
        />

        <NumberInput
          label="Capacity"
          id="capacity"
          value={data.capacity}
          onChange={(raw) => set('capacity', raw)}
          placeholder="e.g. 500 — total number of tickets available"
          error={errors.capacity}
        />

        {/* Sale Start Date */}
        <div>
          <FieldLabel required>Sale Start Date</FieldLabel>
          <DatePickerInput
            value={data.startDate}
            onChange={(val) => { set('startDate', val); }}
            placeholder="Pick sale start date"
          />
          <FieldError message={errors.startDate} />
        </div>

        {/* Sale End Date */}
        <div>
          <FieldLabel required>Sale End Date</FieldLabel>
          <DatePickerInput
            value={data.endDate}
            onChange={(val) => { set('endDate', val); }}
            placeholder="Pick sale end date"
            fromDate={startDateObj}
          />
          <FieldError message={errors.endDate} />
        </div>
      </div>

      <div className="p-[30px] border-t border-[#E6E6E6]">
        <FormActions
          onBack={onBack}
          onCancel={onCancel}
          onNext={handleSubmit}
          nextLabel="Create Ticket"
          loading={loading}
        />
      </div>
    </div>
  );
}
