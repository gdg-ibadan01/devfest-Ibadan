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
import {
  useMe,
  useAdminLogout,
  useRole,
  useRoles,
  usePermissions,
} from '@/app/_module/services';
import AdminOrders from '../../icons/AdminOrders';
import Checkins from '../../icons/Checkins';

const navItems: {
  label: string;
  href: string;
  icon: typeof Home;
  /** Terms used to match the API's view permission labels for this module. */
  moduleTerms?: string[];
}[] = [
  {
    label: 'Home',
    href: '/admin/home',
    icon: Home,
    moduleTerms: ['dashboard'],
  },
  {
    label: 'Admins',
    href: '/admin/admins',
    icon: Admins,
    moduleTerms: ['admin'],
  },
  {
    label: 'Ticket',
    href: '/admin/ticket',
    icon: Ticket,
    moduleTerms: ['ticket'],
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: AdminOrders,
    moduleTerms: ['order'],
  },
  {
    label: 'Attendees',
    href: '/admin/attendees',
    icon: Attendees,
    moduleTerms: ['attendee'],
  },
  {
    label: 'Checkins',
    href: '/admin/checkins',
    icon: Checkins,
    moduleTerms: ['attendee'],
  },
  {
    label: 'Discount & Referral',
    href: '/admin/discount-referral',
    icon: DiscountReferral,
    moduleTerms: ['discount'],
  },
  {
    label: 'Roles & Permission',
    href: '/admin/roles-permission',
    icon: RolesAndPermissions,
    moduleTerms: ['role', 'permission'],
  },
  {
    label: 'Audit Log',
    href: '/admin/audit-log',
    icon: AuditLog,
    moduleTerms: ['audit log', 'audit'],
  },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === '/admin/home') return pathname === '/admin' || pathname === href;
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

function normalizePermissionId(permission: unknown): string | null {
  if (typeof permission === 'string') return permission;
  if (permission && typeof permission === 'object' && 'id' in permission) {
    const id = (permission as { id?: unknown }).id;
    return typeof id === 'string' ? id : null;
  }
  return null;
}

function isViewPermission(label: string): boolean {
  return /\bview\b|\blist\b/i.test(label);
}

function canViewModule(
  terms: string[] | undefined,
  rolePermissionIds: Set<string>,
  allPermissions: { id: string; label: string }[]
): boolean {
  if (!terms) return true;

  return allPermissions.some((permission) => {
    const label = permission.label.toLowerCase();
    return (
      rolePermissionIds.has(permission.id) &&
      isViewPermission(permission.label) &&
      terms.some((term) => label.includes(term))
    );
  });
}

/* ------------------------------------------------------------------ */
/* Nav content — shared between desktop sidebar and mobile drawer       */
/* ------------------------------------------------------------------ */
function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { data: me, isLoading: meLoading } = useMe();
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const { data: allPermissionsData, isLoading: permissionsLoading } =
    usePermissions();
  const { mutate: logout, isPending: loggingOut } = useAdminLogout();

  const matchedRole = rolesData?.roles.find(
    (role) => role.name.toLowerCase() === me?.role?.name?.toLowerCase()
  );
  const { data: roleDetails, isLoading: roleLoading } = useRole(
    matchedRole?.id ?? ''
  );

  const fullName = me?.fullName ?? '';
  const roleName = me?.role?.name ?? '';
  const initials = fullName ? getInitials(fullName) : '??';
  const assignedPermissions =
    roleDetails?.permissions ??
    matchedRole?.permissions ??
    me?.role?.permissions ??
    [];
  const rolePermissionIds = new Set(
    assignedPermissions
      .map(normalizePermissionId)
      .filter((id): id is string => Boolean(id))
  );
  const allPermissions = allPermissionsData?.permissions ?? [];
  const permissionsLoadingState =
    meLoading || rolesLoading || permissionsLoading || roleLoading;
  const visibleItems = permissionsLoadingState
    ? navItems.filter((item) => !item.moduleTerms)
    : navItems.filter((item) =>
        canViewModule(item.moduleTerms, rolePermissionIds, allPermissions)
      );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col">
        {visibleItems.map(({ label, href, icon: Icon }) => {
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
        })}

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
            href="/admin/home"
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
            href="/admin/home"
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
