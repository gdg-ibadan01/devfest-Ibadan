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
  disabled?: boolean;
}

export default function AttendeeActionsMenu({
  onCheckIn,
  disabled,
}: AttendeeActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-1">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={onCheckIn}
          disabled={disabled}
          className="text-[13px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? 'Already Checked In' : 'Check In'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
