'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

const ROUTE_TITLES: Record<string, string> = {
  '/admin': 'Home',
  '/admin/ticket': 'Ticket',
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
    <div className="flex items-center justify-between px-8 py-[22px] border-b border-gray-200 bg-white flex-shrink-0">
      <h1 className="text-[20px] font-bold text-black leading-none">{title}</h1>
      <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
        <Bell size={20} className="text-gray-800" strokeWidth={1.8} />
      </button>
    </div>
  );
}
