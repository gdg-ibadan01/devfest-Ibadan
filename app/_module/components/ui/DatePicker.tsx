'use client';

import { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/app/_module/lib/utils';
import 'react-day-picker/style.css';

interface DatePickerInputProps {
  value: string; // ISO date string 'YYYY-MM-DD'
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled,
  fromDate,
  toDate,
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);

  const selected = value && isValid(parseISO(value)) ? parseISO(value) : undefined;
  const displayValue = selected ? format(selected, 'dd MMM yyyy') : '';

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex items-center w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-left bg-white transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400',
            'hover:border-gray-300',
            !displayValue && 'text-gray-400',
            displayValue && 'text-gray-800',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <CalendarIcon size={15} className="mr-3 text-gray-400 flex-shrink-0" />
          <span className="flex-1">{displayValue || placeholder}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-[300px]"
          onInteractOutside={() => setOpen(false)}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(day) => {
              onChange(day ? format(day, 'yyyy-MM-dd') : '');
              if (day) setOpen(false);
            }}
            startMonth={fromDate}
            endMonth={toDate}
            classNames={{
              root: 'w-full text-[13px]',
              month: 'relative',
              month_caption: 'flex items-center justify-center py-2 px-10',
              caption_label: 'text-[14px] font-semibold text-gray-800',
              nav: 'absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-1 py-1 pointer-events-none',
              button_previous: 'p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 pointer-events-auto',
              button_next: 'p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 pointer-events-auto',
              weeks: 'w-full',
              week: 'grid grid-cols-7',
              weekdays: 'grid grid-cols-7 mb-1',
              weekday: 'text-center text-[11px] font-medium text-gray-400 py-1',
              day: 'flex items-center justify-center',
              day_button: cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-[13px] transition-colors',
                'hover:bg-gray-100 cursor-pointer'
              ),
              selected: '[&>button]:!bg-black [&>button]:!text-white [&>button]:!rounded-full',
              today: '[&>button]:font-bold [&>button]:text-blue-600',
              outside: '[&>button]:text-gray-300',
              disabled: '[&>button]:text-gray-200 [&>button]:cursor-not-allowed',
            }}
          />
          {value && (
            <div className="border-t border-gray-100 pt-2 px-1 pb-1 mt-1">
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className="text-[12px] text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear date
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
