'use client';

import { Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Ellipsis from '@/app/_module/components/icons/Ellipsis';

interface DiscountActionsMenuProps {
  onUpdate: () => void;
}

export default function DiscountActionsMenu({
  onUpdate,
}: DiscountActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-gray-100">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={onUpdate}
          className="cursor-pointer text-[13px]"
        >
          Update discount
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
