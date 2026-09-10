'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Ellipsis from '@/app/_module/components/icons/Ellipsis';

interface AdminActionsMenuProps {
  onViewDetails: () => void;
  onDeactivate: () => void;
  disableDeactivate?: boolean;
}

export default function AdminActionsMenu({
  onViewDetails,
  onDeactivate,
  disableDeactivate,
}: AdminActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-1">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={onViewDetails}
          className="text-[13px] cursor-pointer"
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDeactivate}
          disabled={disableDeactivate}
          className="text-[13px] cursor-pointer text-red-500 focus:text-red-600"
        >
          Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
