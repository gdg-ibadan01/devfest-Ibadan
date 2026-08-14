'use client';

import { cn } from '@/app/_module/lib/utils';
import { ClipboardList, Tag, Settings2, Check } from 'lucide-react';
import type { CreateTicketStep } from '../_types/ticket.types';

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
    icon: <ClipboardList size={14} />,
    activeIcon: <ClipboardList size={14} />,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: <Tag size={14} />,
    activeIcon: <Tag size={14} />,
  },
  {
    id: 'advancedSettings',
    label: 'Advanced Settings',
    icon: <Settings2 size={14} />,
    activeIcon: <Settings2 size={14} />,
  },
];

const stepOrder: CreateTicketStep[] = ['basicInfo', 'pricing', 'advancedSettings'];

interface CreateTicketStepperProps {
  currentStep: CreateTicketStep;
}

export default function CreateTicketStepper({ currentStep }: CreateTicketStepperProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepIndex = stepOrder.indexOf(step.id);
          const isCompleted = stepIndex < currentIndex;
          const isActive = stepIndex === currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step node */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                    isCompleted || isActive
                      ? 'bg-core-green text-white'
                      : 'border-2 border-gray-300 text-gray-400 bg-white'
                  )}
                >
                  {isCompleted ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={cn(
                    'text-[13px] font-medium whitespace-nowrap',
                    isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'
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
