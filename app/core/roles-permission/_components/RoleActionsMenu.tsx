'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Ellipsis from '@/app/_module/components/icons/Ellipsis';

interface RoleActionsMenuProps {
  onDeactivate: () => void;
  onEdit: () => void;
}

export default function RoleActionsMenu({
  onDeactivate,
  onEdit,
}: RoleActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-1">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={onDeactivate}
          className="text-[13px] cursor-pointer"
        >
          Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onEdit}
          className="text-[13px] cursor-pointer"
        >
          Edit Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
