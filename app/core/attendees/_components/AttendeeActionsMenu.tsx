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
  /** Hidden when omitted (role lacks attendees.check_in). */
  onCheckIn?: () => void;
  /** Order isn't PAID — check-in would be rejected by the API. */
  notPaid?: boolean;
  /** Shown when the attendee is checked in today. */
  onUndoCheckIn?: () => void;
  /** Re-send this attendee their ticket email. Hidden when omitted. */
  onResendTicket?: () => void;
  resending?: boolean;
  disabled?: boolean;
  /** True while a check-in request for this specific row is in flight. */
  loading?: boolean;
}

export default function AttendeeActionsMenu({
  onCheckIn,
  notPaid,
  onUndoCheckIn,
  onResendTicket,
  resending,
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
      <DropdownMenuContent align="end" className="w-44">
        {onCheckIn && (
          <DropdownMenuItem
            onClick={onCheckIn}
            disabled={disabled || notPaid || loading}
            className="text-[13px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Checking In…'
              : notPaid
                ? 'Not paid — can’t check in'
                : disabled
                  ? 'Already Checked In Today'
                  : 'Check In'}
          </DropdownMenuItem>
        )}
        {onUndoCheckIn && (
          <DropdownMenuItem
            onClick={onUndoCheckIn}
            className="text-[13px] cursor-pointer text-[#C5221F]"
          >
            Undo today&apos;s check-in
          </DropdownMenuItem>
        )}
        {!onCheckIn && !onResendTicket && !onUndoCheckIn && (
          <DropdownMenuItem disabled className="text-[13px]">
            No actions available
          </DropdownMenuItem>
        )}
        {onResendTicket && (
          <DropdownMenuItem
            onClick={onResendTicket}
            disabled={resending}
            className="text-[13px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend ticket email'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
