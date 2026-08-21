'use client';

import { ReactNode } from 'react';
import { Menu, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DevfestLogo from '../../icons/DevfestLogo.svg';
import AdminNotificationBell from '../../icons/AdminNotificationBell';
import { useSidenav } from '@/app/_module/context/SidenavContext';

interface AdminHeaderWrapperProps {
  children: ReactNode;
  title: string;
}

const AdminWrapper = ({ children, title }: AdminHeaderWrapperProps) => {
  const { open } = useSidenav();

  return (
    <div className="w-full min-h-screen">
      <header className="border-b border-l border-[#dedede] bg-white h-[81px] px-4 lg-px-6 flex items-center">
        {/* DESKTOP header */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <h1 className="text-[25px] font-bold leading-tight text-[#1e1e1e]">
            {title}
          </h1>
          <AdminNotificationBell />
        </div>

        {/* MOBILE header */}
        <div className="flex lg:hidden items-center w-full gap-3">
          {/* Logo */}
          <Link href="/admin/home" className="flex-shrink-0 w-[90px]">
            <Image src={DevfestLogo} alt="DevFest Ibadan" priority />
          </Link>

          <h1 className="flex-1 text-center text-[17px] font-bold leading-tight text-[#1e1e1e] truncate">
            {title}
          </h1>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Bell size={22} />
            <button
              type="button"
              onClick={open}
              className="flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
};

export default AdminWrapper;
