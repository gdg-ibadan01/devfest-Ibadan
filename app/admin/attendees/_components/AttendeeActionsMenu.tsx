'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Ellipsis from '@/app/_module/components/icons/Ellipsis';

interface AttendeeActionsMenuProps {
  onCheckIn: () => void;
}

export default function AttendeeActionsMenu({
  onCheckIn,
}: AttendeeActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-1">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={onCheckIn}
          className="text-[13px] cursor-pointer"
        >
          Check In
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
