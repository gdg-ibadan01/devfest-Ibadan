'use client';

import { cn } from '@/app/_module/lib/utils';
import { ClipboardList, Tag, Settings2, Check } from 'lucide-react';
import type { CreateTicketStep } from '../_types/ticket.types';
import BasicInfo from '@/app/_module/components/icons/BasicInfo';
import Pricing, {
  PricingInactive,
} from '@/app/_module/components/icons/Pricing';
import AdvancedSettings, {
  AdvancedSettingsInactive,
} from '@/app/_module/components/icons/AdvancedSettings';

interface Step {
  id: CreateTicketStep;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 'basicInfo',
    label: 'Basic Info',
    icon: <BasicInfo />,
    activeIcon: <BasicInfo />,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: <PricingInactive />,
    activeIcon: <Pricing />,
  },
  {
    id: 'advancedSettings',
    label: 'Advanced Settings',
    icon: <AdvancedSettingsInactive />,
    activeIcon: <AdvancedSettings />,
  },
];

const stepOrder: CreateTicketStep[] = [
  'basicInfo',
  'pricing',
  'advancedSettings',
];

interface CreateTicketStepperProps {
  currentStep: CreateTicketStep;
}

export default function CreateTicketStepper({
  currentStep,
}: CreateTicketStepperProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-[16px] py-[20px]">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepIndex = stepOrder.indexOf(step.id);
          const isCompleted = stepIndex < currentIndex;
          const isActive = stepIndex === currentIndex;

          return (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Step node */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={cn(
                    'w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all',
                    isCompleted || isActive
                      ? 'bg-core-green text-[#0E6213]'
                      : 'border border-[#7ED583] text-[#7ED583] bg-[#DEF9DF]'
                  )}
                >
                  {isCompleted || isActive ? step.activeIcon : step.icon}
                </div>
                <span
                  className={cn(
                    'text-[13px] font-medium whitespace-nowrap',
                    isCompleted || isActive
                      ? 'text-[#0E6213]'
                      : 'text-[#7ED583]'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line (not after last step) */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      'h-[2px] w-full',
                      isCompleted
                        ? 'bg-core-green'
                        : 'border-t-2 border-dashed border-gray-300'
                    )}
                    style={!isCompleted ? { background: 'none' } : {}}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
