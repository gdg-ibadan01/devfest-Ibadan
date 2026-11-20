'use client';

import { cn } from '@/app/_module/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XCircle } from 'lucide-react';
import DevfestLogo from '../../icons/DevfestLogo.svg';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Home from '../../icons/Home';
import Ticket from '../../icons/Ticket';
import DiscountReferral from '../../icons/DiscountReferral';
import RolesAndPermissions from '../../icons/RolesAndPermissions';
import Admins from '../../icons/Admins';
import Attendees from '../../icons/Attendees';
import AuditLog from '../../icons/AuditLog';
import Logout from '../../icons/Logout';
import { useSidenav } from '@/app/_module/context/SidenavContext';
import { useMe, useAdminLogout } from '@/app/_module/services';
import { ADMIN_NAV } from '@/app/_module/config/adminNav';
import { hasAnyPermission } from '@/app/_module/lib/permissions';
import type { PermissionId } from '@/app/_module/api/types';
import AdminOrders from '../../icons/AdminOrders';
import Checkins from '../../icons/Checkins';
import Mail from '../../icons/Mail';
import PaymentGateway from '../../icons/PaymentGateway';

const NAV_ICONS: Record<string, typeof Home> = {
  '/core/home': Home,
  '/core/admins': Admins,
  '/core/ticket': Ticket,
  '/core/orders': AdminOrders,
  '/core/attendees': Attendees,
  '/core/checkins': Checkins,
  '/core/emails': Mail,
  '/core/discount-referral': DiscountReferral,
  '/core/payment-gateway': PaymentGateway,
  '/core/roles-permission': RolesAndPermissions,
  '/core/audit-log': AuditLog,
};

const navItems = ADMIN_NAV.map((item) => ({
  ...item,
  icon: NAV_ICONS[item.href] ?? Home,
}));

const isActivePath = (pathname: string, href: string) => {
  if (href === '/core/home') return pathname === '/core' || pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

/** Extract initials from a full name */
function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

function NavLinksSkeleton() {
  return (
    <div
      className="flex flex-1 flex-col"
      role="status"
      aria-label="Loading navigation"
    >
      {navItems.map(({ href }) => (
        <div key={href} className="flex h-[54px] items-center gap-3 px-7">
          <span className="h-[18px] w-[18px] rounded bg-white/15 animate-pulse" />
          <span className="h-[18px] w-1/2 rounded bg-white/15 animate-pulse" />
        </div>
      ))}
      {/* <span className="sr-only">Loading navigation links</span> */}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav content — shared between desktop sidebar and mobile drawer       */
/* ------------------------------------------------------------------ */
function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { data: me, isLoading: meLoading } = useMe();
  const { mutate: logout, isPending: loggingOut } = useAdminLogout();

  const fullName = me?.fullName ?? '';
  const roleName = me?.role?.name ?? '';
  const initials = fullName ? getInitials(fullName) : '--';
  // /admin/me returns the role's permission IDs directly, so the sidebar no
  // longer needs roles.list (which check-in-only staff don't have).
  const permissions = (me?.role?.permissions ?? []) as PermissionId[];

  const permissionsLoadingState = meLoading;
  const visibleItems = navItems.filter((item) =>
    hasAnyPermission(permissions, item.permissions)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col">
        {permissionsLoadingState ? (
          <NavLinksSkeleton />
        ) : (
          visibleItems.map(({ label, href, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onLinkClick}
                className={cn(
                  'flex h-[54px] items-center gap-3 px-7 text-[14px] font-normal text-white transition-colors hover:bg-white/10',
                  active && 'bg-core-blue hover:bg-core-blue'
                )}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex h-[54px] items-center gap-3 px-7 text-[14px] font-normal text-white transition-colors hover:bg-white/10 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Logout />
          <span>{loggingOut ? 'Signing out…' : 'Log out'}</span>
        </button>
      </div>

      {/* Footer profile */}
      <div className="px-5 pb-8 mt-auto">
        <div className="flex items-center gap-3 rounded-[8px] bg-white px-3 py-3">
          <Avatar>
            <AvatarFallback className="bg-[#4285F4] text-white text-md font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-5 text-core-blue truncate">
              {fullName || '—'}
            </p>
            <p className="text-[11px] leading-5 text-[#474C52] truncate capitalize">
              {roleName || '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AdminSidenav                                                         */
/* Desktop: sticky left column rendered by layouts.tsx                  */
/* Mobile: hidden — replaced by animated drawer triggered by hamburger  */
/* ------------------------------------------------------------------ */
const AdminSidenav = () => {
  const { isOpen, close } = useSidenav();

  return (
    <>
      {/* ---- DESKTOP SIDEBAR (lg+) ---- */}
      <aside className="hidden lg:flex flex-col bg-[#1f1f1f] text-white h-screen sticky top-0">
        {/* Logo */}
        <div className="flex h-[80px] items-center justify-center bg-white px-8 flex-shrink-0">
          <Link
            href="/core/home"
            className="flex w-[120px] items-center justify-center"
          >
            <Image src={DevfestLogo} alt="DevFest Ibadan" priority />
          </Link>
        </div>
        <NavContent />
      </aside>

      {/* MOBILE DRAWER (below lg) */}
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={close}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col bg-[#1f1f1f] text-white',
          'transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer header: logo + close button */}
        <div className="flex h-[80px] items-center justify-between bg-white px-5 flex-shrink-0">
          <Link
            href="/core/home"
            onClick={close}
            className="flex w-[90px] items-center"
          >
            <Image src={DevfestLogo} alt="DevFest Ibadan" priority />
          </Link>
          <button
            type="button"
            onClick={close}
            className="flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close navigation"
          >
            <XCircle size={24} />
          </button>
        </div>
        <NavContent onLinkClick={close} />
      </aside>
    </>
  );
};

export default AdminSidenav;
