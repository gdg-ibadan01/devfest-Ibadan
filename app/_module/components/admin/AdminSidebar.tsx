'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  BadgePercent,
  ShieldCheck,
  Users,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import DevfestLogo from '../icons/DevfestLogo.svg';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const navItems = [
  { label: 'Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Ticket', icon: Ticket, href: '/admin/tickets' },
  { label: 'Discount & Referral', icon: BadgePercent, href: '/admin/discounts' },
  { label: 'Roles & Permission', icon: ShieldCheck, href: '/admin/roles' },
  { label: 'Attendees', icon: Users, href: '/admin/attendees' },
  { label: 'Audit Log', icon: ClipboardList, href: '/admin/audit' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <aside className="w-[265px] h-screen flex flex-col border-r border-gray-200 bg-white flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/admin" className="block">
          <Image
            src={DevfestLogo}
            alt="DevFest Ibadan"
            width={130}
            height={38}
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-[11px] rounded-lg text-[14px] font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-core-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-[11px] rounded-lg text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 mt-1 w-full text-left"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Log out</span>
        </button>
      </nav>

      {/* User Card */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-core-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
            ME
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">
              Mary Esivue
            </p>
            <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
