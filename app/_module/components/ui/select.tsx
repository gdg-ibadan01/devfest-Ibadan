'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/app/_module/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

export const CustomSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  CustomSelectProps
>(
  (
    {
      label,
      placeholder = 'Select an option',
      options,
      value,
      defaultValue,
      onValueChange,
      disabled,
      name,
      className,
      triggerClassName,
      contentClassName,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <label className="text-[#4D4D4D] text-sm">
            {label}
          </label>
        )}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
          name={name}
        >
          <SelectTrigger ref={ref} className={triggerClassName} {...props}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={contentClassName}>
            {children
              ? children
              : options?.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
CustomSelect.displayName = 'CustomSelect';
