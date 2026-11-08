'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, XCircle } from 'lucide-react';
import { isValid, parseISO } from 'date-fns';
import { DatePickerInput } from '@/app/_module/components/ui/DatePicker';
import { useUpdateDiscount } from '@/app/_module/services/discounts.service';
import type { DiscountListItemDto } from '@/app/_module/api/types';
interface UpdateDiscountModalProps {
  open: boolean;
  discount: DiscountListItemDto | null;
  onClose: () => void;
}
function formatValue(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === ''
    ? '—'
    : String(value);
}
function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p className="text-[13px] font-semibold text-gray-900 break-words">
        {formatValue(value)}
      </p>
    </div>
  );
}
export default function UpdateDiscountModal({
  open,
  discount,
  onClose,
}: UpdateDiscountModalProps) {
  const [validTo, setValidTo] = useState('');
    const { mutate: updateDiscount, isPending } = useUpdateDiscount();
    
  useEffect(() => {
    if (!open || !discount) return;
    setValidTo(discount.validTo ? discount.validTo.slice(0, 10) : '');
  }, [open, discount]);
    
    
  if (!open || !discount) return null;
  const validFrom = discount.validFrom?.slice(0, 10);
  const fromDate =
    validFrom && isValid(parseISO(validFrom)) ? parseISO(validFrom) : undefined;
  const handleClose = () => {
    if (isPending) return;
    onClose();
  };
    
  const handleSubmit = () => {
    updateDiscount(
      {
        discountId: discount.id,
        dto: { validTo: validTo || null },
      },
      { onSuccess: onClose }
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={handleClose} aria-hidden />
      <div className="fixed right-[10px] top-[10px] bottom-[10px] w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-[12px]">
        <div className="flex items-center justify-between px-[32px] py-[24px] bg-[#FAFAFA] border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900">
            Update Discount
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            aria-label="Close update discount modal"
          >
            <XCircle size={25} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[30px] py-6">
          <h3 className="text-[20px] font-bold text-gray-900 mb-5">
            {discount.name}
          </h3>
          <div className="border border-gray-200 rounded-xl p-5 mb-5">
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Discount Name" value={discount.name} />
              <Detail label="Code" value={discount.code} />
              <Detail
                label="Type"
                value={discount.type === 'SINGLE' ? 'Single Use' : 'Bulk'}
              />
              <Detail label="Amount" value={`₦${discount.amount}`} />
              <Detail
                label="Usage"
                value={`${discount.usage} / ${discount.limit}`}
              />
              <Detail label="Status" value={discount.status} />
              <div className="col-span-2">
                <Detail
                  label="Tickets"
                  value={
                    discount.tickets.length > 0
                      ? discount.tickets.map((ticket) => ticket.name).join(', ')
                      : null
                  }
                />
              </div>
              <Detail
                label="Valid From"
                value={discount.validFrom.slice(0, 10)}
              />
              <Detail label="Valid To" value={discount.validTo?.slice(0, 10)} />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-800 mb-2">
              Valid To
            </p>
            <DatePickerInput
              value={validTo}
              onChange={setValidTo}
              placeholder="Select end date"
              fromDate={fromDate}
              disabled={isPending}
            />
            <p className="mt-1 text-[12px] text-gray-400">
              Clear the date to remove the discount expiry.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-6 py-[10px] rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-[10px] rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving…' : 'Save Changes'}
            {!isPending && <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
