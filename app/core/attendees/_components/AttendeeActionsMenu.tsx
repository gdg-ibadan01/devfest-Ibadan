'use client';

import { Loader2 } from 'lucide-react';
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
  /** True while a check-in request for this specific row is in flight. */
  loading?: boolean;
}

export default function AttendeeActionsMenu({
  onCheckIn,
  disabled,
  loading,
}: AttendeeActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={loading}
          className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-1 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin text-gray-400" />
          ) : (
            <Ellipsis />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={onCheckIn}
          disabled={disabled || loading}
          className="text-[13px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Checking In…' : disabled ? 'Already Checked In' : 'Check In'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
