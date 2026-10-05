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
}

export default function OrderActionsMenu({
  onViewDetails,
}: OrderActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-1">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={onViewDetails}
          className="text-[13px] cursor-pointer"
        >
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
