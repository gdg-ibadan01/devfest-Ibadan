'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

const ROUTE_TITLES: Record<string, string> = {
  '/admin': 'Home',
  '/admin/tickets': 'Ticket',
  '/admin/tickets/create': 'Ticket',
  '/admin/discounts': 'Discount & Referral',
  '/admin/roles': 'Roles & Permission',
  '/admin/attendees': 'Attendees',
  '/admin/audit': 'Audit Log',
};

export default function AdminTopBar() {
  const pathname = usePathname();

  const title =
    Object.entries(ROUTE_TITLES)
      .reverse()
      .find(([route]) => pathname.startsWith(route))?.[1] ?? 'Dashboard';

  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white">
      <h1 className="text-[22px] font-bold text-black">{title}</h1>
      <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
        <Bell size={19} className="text-gray-700" />
      </button>
    </div>
  );
}
