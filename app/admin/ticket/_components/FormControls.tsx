import { cn } from '@/app/_module/lib/utils';
import { Check } from 'lucide-react';
import { DatePickerInput } from '@/app/_module/components/ui/DatePicker';

// Re-export so steps only import from FormControls
export { DatePickerInput };

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
}

export function FieldLabel({ children, htmlFor, className, required }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-[13px] font-medium text-gray-800 mb-2', className)}
    >
      {children}
      {required && <span style={{ color: '#E61530' }} className="ml-1">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[12px]" style={{ color: '#E61530' }}>{message}</p>;
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function TextInput({ label, id, className, required, error, ...props }: TextInputProps) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>}
      <input
        id={id}
        className={cn(
          'w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors bg-white',
          error ? 'focus:border-[#E61530]' : 'border-gray-200 focus:border-gray-400',
          className
        )}
        style={error ? { borderColor: '#E61530' } : undefined}
        {...props}
      />
      <FieldError message={error} />
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function TextArea({ label, id, className, required, error, ...props }: TextAreaProps) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>}
      <textarea
        id={id}
        rows={5}
        className={cn(
          'w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors resize-none bg-white',
          error ? 'focus:border-[#E61530]' : 'border-gray-200 focus:border-gray-400',
          className
        )}
        style={error ? { borderColor: '#E61530' } : undefined}
        {...props}
      />
      <FieldError message={error} />
    </div>
  );
}

interface CurrencyInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

/** Format a raw integer string as comma-separated thousands for display */
function formatIntDisplay(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  return digits ? parseInt(digits, 10).toLocaleString('en-NG') : '';
}

interface NumberInputProps {
  label?: string;
  id?: string;
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function NumberInput({ label, id, value, onChange, placeholder, required, error, className }: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '').replace(/\D/g, '');
    onChange(raw);
  };
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={formatIntDisplay(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full border rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors bg-white',
          error ? 'focus:border-[#E61530]' : 'border-gray-200 focus:border-gray-400',
          className
        )}
        style={error ? { borderColor: '#E61530' } : undefined}
      />
      <FieldError message={error} />
    </div>
  );
}

/** Format a raw numeric string as comma-separated thousands for display (supports decimals) */
function formatDisplay(raw: string): string {
  if (!raw) return '';
  // Allow partial decimal entry: don't format if ends with '.' or '0' after decimal
  const parts = raw.split('.');
  const intPart = parts[0].replace(/\D/g, '');
  const formattedInt = intPart ? parseInt(intPart, 10).toLocaleString('en-NG') : '';
  if (parts.length > 1) return `${formattedInt}.${parts[1]}`;
  return formattedInt;
}

export function CurrencyInput({
  label,
  id,
  value,
  onChange,
  placeholder = '0.00',
  required,
  error,
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip commas — keep raw numeric value in state
    const raw = e.target.value.replace(/,/g, '');
    // Only allow valid numeric input (digits, single dot, optional decimals)
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      onChange(raw);
    }
  };

  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
      <div
        className={cn(
          'flex items-center border rounded-lg overflow-hidden transition-colors bg-white focus-within:ring-2 focus-within:ring-black/10',
          error ? '' : 'border-gray-200 focus-within:border-gray-400'
        )}
        style={error ? { borderColor: '#E61530' } : undefined}
      >
        <span className="px-4 py-3 text-[13px] text-gray-500 border-r border-gray-200 bg-gray-50 whitespace-nowrap select-none">
          NGN (Naira)
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={formatDisplay(value)}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
      </div>
      <FieldError message={error} />
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
  required?: boolean;
}

export function DeclarationDatePicker({
  label,
  value,
  onChange,
  options,
  required,
}: DeclarationDatePickerProps) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="flex gap-3 flex-wrap">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-[10px] rounded-md border text-[13px] transition-all',
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
          'relative inline-flex w-[32px] h-[16px] rounded-[24px] transition-colors duration-200 focus:outline-none',
          checked ? 'bg-black' : 'bg-gray-300'
        )}
      >
        <span
          className={cn(
            'inline-block w-[14px] h-[14px] rounded-full bg-white shadow-sm absolute top-[1px] transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-[0.8px]'
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
  onBack?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function FormActions({
  onCancel,
  onNext,
  nextLabel,
  cancelLabel = 'Cancel',
  onBack,
  disabled,
  loading,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      {/* Back button — left side */}
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-[20px] py-3 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span aria-hidden>←</span> Back
        </button>
      ) : (
        <span />
      )}

      {/* Cancel + Proceed — right side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-[20px] py-3 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disabled || loading}
          className="px-[32px] py-3 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting…' : nextLabel}
          {!loading && <span aria-hidden>→</span>}
        </button>
      </div>
    </div>
  );
}
