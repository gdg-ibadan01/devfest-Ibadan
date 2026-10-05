import {
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  Link2,
  Loader2,
} from 'lucide-react';
import { type AppliedDiscount } from '@/app/_module/services/discount.service';

export interface TicketDiscountFieldProps {
  discountCode?: string;
  setDiscountCode?: (val: string) => void;
  appliedDiscount?: AppliedDiscount | null;
  onApplyDiscount?: (code: string) => void;
  onRemoveDiscount?: () => void;
  isApplyingDiscount?: boolean;
  discountError?: string;
  setDiscountError?: (err: string) => void;
  isDiscountFromUrl?: boolean;
}

export default function TicketDiscountField({
  discountCode = '',
  setDiscountCode,
  appliedDiscount = null,
  onApplyDiscount,
  onRemoveDiscount,
  isApplyingDiscount = false,
  discountError = '',
  setDiscountError,
  isDiscountFromUrl = false,
}: Readonly<TicketDiscountFieldProps>) {
  const trimmedDiscountCode = (discountCode || '').trim();
  const isDiscountValid = Boolean(trimmedDiscountCode);

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <label
        htmlFor="discountCode"
        className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium flex items-center justify-between"
      >
        <span className="flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-[#515151]" />
          Discount Code
        </span>
        {appliedDiscount ? (
          <span className="text-[12px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            {isDiscountFromUrl && (
              <Link2 className="w-3 h-3 text-emerald-600" />
            )}
            {isDiscountFromUrl ? 'Applied from Link' : 'Applied'}
          </span>
        ) : isApplyingDiscount && isDiscountFromUrl ? (
          <span className="text-[12px] text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
            Applying from link...
          </span>
        ) : null}
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            id="discountCode"
            placeholder="Enter discount code"
            value={discountCode}
            onChange={(e) => {
              setDiscountCode?.(e.target.value.toUpperCase());
              if (discountError && setDiscountError) setDiscountError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (
                  !appliedDiscount &&
                  isDiscountValid &&
                  !isApplyingDiscount &&
                  onApplyDiscount
                ) {
                  onApplyDiscount(trimmedDiscountCode);
                }
              }
            }}
            disabled={Boolean(appliedDiscount) || isApplyingDiscount}
            className={`w-full border rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none transition-colors uppercase disabled:bg-gray-50 disabled:text-gray-600 tracking-wider font-mono text-[14px] ${
              discountError && !appliedDiscount
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-[#4285F4]'
            }`}
          />
          {appliedDiscount && (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
        </div>

        {appliedDiscount ? (
          <button
            type="button"
            onClick={onRemoveDiscount}
            className="px-4 py-2 text-[13px] md:text-[14px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-[8px] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              onApplyDiscount &&
              isDiscountValid &&
              onApplyDiscount(trimmedDiscountCode)
            }
            disabled={!isDiscountValid || isApplyingDiscount}
            title={
              !trimmedDiscountCode
                ? 'Enter a discount code'
                : 'Click to apply discount'
            }
            className="px-5 py-2 text-[14px] md:text-[15px] font-semibold text-white bg-[#1E1E1E] hover:bg-core-blue disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed rounded-[8px] transition-all shrink-0 flex items-center gap-2 cursor-pointer disabled:hover:bg-gray-200"
          >
            {isApplyingDiscount ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              'Apply'
            )}
          </button>
        )}
      </div>

      {/* Applied Discount Feedback */}
      {appliedDiscount && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-[8px] px-3.5 py-2 text-emerald-800 text-[13px] md:text-[14px] mt-0.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Discount applied{isDiscountFromUrl ? ' from link' : ''}:{' '}
              <strong className="font-bold">
                ₦
                {appliedDiscount.amount.toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                off
              </strong>
            </span>
          </div>
          <span className="font-mono text-[11px] md:text-[12px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
            {isDiscountFromUrl && (
              <Link2 className="w-3 h-3 text-emerald-700" />
            )}
            {appliedDiscount.code}
          </span>
        </div>
      )}

      {/* Error Message */}
      {discountError && !appliedDiscount && (
        <div className="flex items-center gap-1.5 text-red-600 text-[13px] md:text-[14px] font-medium mt-1">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="text-red-600 font-medium">{discountError}</span>
        </div>
      )}
    </div>
  );
}
