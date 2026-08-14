'use client';

import { MoreVertical, Eye, Pencil, Trash2, } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Ellipsis from '@/app/_module/components/icons/Ellipsis';

interface TicketActionsMenuProps {
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TicketActionsMenu({
  onPreview,
  onEdit,
  onDelete,
}: TicketActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={onPreview}
          className="flex items-center gap-2 text-[13px] cursor-pointer"
        >
          <Eye size={14} />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onEdit}
          className="flex items-center gap-2 text-[13px] cursor-pointer"
        >
          <Pencil size={14} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center gap-2 text-[13px] text-red-500 focus:text-red-500 cursor-pointer"
        >
          <Trash2 size={14} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
