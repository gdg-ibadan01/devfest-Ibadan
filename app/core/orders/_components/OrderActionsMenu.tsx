'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Ellipsis from '@/app/_module/components/icons/Ellipsis';

interface OrderActionsMenuProps {
  onViewDetails: () => void;
  /** Shown for unpaid/cancelled orders: confirm a payment the gateway has. */
  onResolvePayment?: () => void;
}

export default function OrderActionsMenu({
  onViewDetails,
  onResolvePayment,
}: OrderActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-1">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={onViewDetails}
          className="text-[13px] cursor-pointer"
        >
          View Details
        </DropdownMenuItem>
        {onResolvePayment && (
          <DropdownMenuItem
            onClick={onResolvePayment}
            className="text-[13px] cursor-pointer font-medium text-[#1B873B]"
          >
            Resolve payment
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
