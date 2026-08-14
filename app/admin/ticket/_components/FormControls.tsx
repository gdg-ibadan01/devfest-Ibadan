import { cn } from '@/app/_module/lib/utils';
import { Check } from 'lucide-react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function FieldLabel({ children, htmlFor, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-[13px] font-medium text-gray-800 mb-2', className)}
    >
      {children}
    </label>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function TextInput({ label, id, className, ...props }: TextInputProps) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <input
        id={id}
        className={cn(
          'w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors bg-white',
          className
        )}
        {...props}
      />
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, id, className, ...props }: TextAreaProps) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <textarea
        id={id}
        rows={5}
        className={cn(
          'w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors resize-none bg-white',
          className
        )}
        {...props}
      />
    </div>
  );
}

interface CurrencyInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CurrencyInput({
  label,
  id,
  value,
  onChange,
  placeholder = '0.00',
}: CurrencyInputProps) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black/10 focus-within:border-gray-400 transition-colors bg-white">
        <span className="px-4 py-3 text-[13px] text-gray-500 border-r border-gray-200 bg-gray-50 whitespace-nowrap select-none">
          NGN (Naira)
        </span>
        <input
          id={id}
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

interface DeclarationOption {
  value: string;
  label: string;
  sub?: string;
}

interface DeclarationDatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DeclarationOption[];
}

export function DeclarationDatePicker({
  label,
  value,
  onChange,
  options,
}: DeclarationDatePickerProps) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-3 flex-wrap">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-[10px] rounded-lg border text-[13px] transition-all',
                isSelected
                  ? 'border-black bg-white text-black'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
              )}
            >
              <span>
                {opt.label}
                {opt.sub && (
                  <span className="text-gray-400 ml-1 text-[12px]">({opt.sub})</span>
                )}
              </span>
              {isSelected ? (
                <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export function ToggleRow({ icon, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="text-gray-400">{icon}</span>
        <div>
          <p className="text-[13px] font-medium text-gray-800">{label}</p>
          <p className="text-[12px] text-gray-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none',
          checked ? 'bg-black' : 'bg-gray-300'
        )}
      >
        <span
          className={cn(
            'inline-block w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

interface FormActionsProps {
  onCancel: () => void;
  onNext: () => void;
  nextLabel: string;
  cancelLabel?: string;
}

export function FormActions({
  onCancel,
  onNext,
  nextLabel,
  cancelLabel = 'Cancel',
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-8 py-3 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onNext}
        className="px-8 py-3 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
      >
        {nextLabel}
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
