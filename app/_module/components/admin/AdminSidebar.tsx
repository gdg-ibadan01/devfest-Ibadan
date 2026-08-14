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
import { cn } from '@/app/_module/lib/utils';

const navItems = [
  { label: 'Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Ticket', icon: Ticket, href: '/admin/ticket' },
  { label: 'Discount & Referral', icon: BadgePercent, href: '/admin/discounts' },
  { label: 'Roles & Permission', icon: ShieldCheck, href: '/admin/roles' },
  { label: 'Attendees', icon: Users, href: '/admin/attendees' },
  { label: 'Audit Log', icon: ClipboardList, href: '/admin/audit' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <aside className="w-[265px] h-screen flex flex-col bg-[#1a1a1a] flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
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
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
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
              className={cn(
                'flex items-center gap-3 px-4 py-[11px] rounded-lg text-[14px] font-medium transition-colors duration-150',
                isActive
                  ? 'bg-core-blue text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-[11px] rounded-lg text-[14px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-150 mt-1 w-full text-left"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Log out</span>
        </button>
      </nav>

      {/* User Card */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-core-blue flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 select-none">
            ME
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-core-blue truncate leading-tight">
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
