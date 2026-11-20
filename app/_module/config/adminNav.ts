import type { PermissionId } from '@/app/_module/api/types';

/**
 * Single source of truth for which permission(s) open each admin module.
 * A module is visible / reachable when the admin's role has ANY of its
 * permissions. Used by the sidebar and by AuthGuard's route check, and
 * mirrors the backend's @RequirePermission on the endpoints each page calls.
 */
export interface AdminNavItem {
  label: string;
  href: string;
  permissions: PermissionId[];
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Home', href: '/core/home', permissions: ['dashboard.view'] },
  { label: 'Admins', href: '/core/admins', permissions: ['admins.list'] },
  { label: 'Ticket', href: '/core/ticket', permissions: ['tickets.list'] },
  { label: 'Orders', href: '/core/orders', permissions: ['orders.list'] },
  {
    label: 'Attendees',
    href: '/core/attendees',
    permissions: ['attendees.list', 'attendees.check_in'],
  },
  {
    label: 'Checkins',
    href: '/core/checkins',
    permissions: ['attendees.check_in', 'attendees.list'],
  },
  {
    label: 'Emails',
    href: '/core/emails',
    permissions: ['emails.manage'],
  },
  {
    label: 'Discount & Referral',
    href: '/core/discount-referral',
    permissions: ['discounts.list'],
  },
  {
    label: 'Payment Gateway',
    href: '/core/payment-gateway',
    permissions: ['payment_gateway.view', 'payment_gateway.manage'],
  },
  {
    label: 'Roles & Permission',
    href: '/core/roles-permission',
    permissions: ['roles.list'],
  },
  {
    label: 'Audit Log',
    href: '/core/audit-log',
    permissions: ['audit-logs.view-list'],
  },
];

/** The nav item that owns `pathname` (longest matching prefix), if any. */
export function navItemForPath(pathname: string): AdminNavItem | undefined {
  return ADMIN_NAV.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  ).sort((a, b) => b.href.length - a.href.length)[0];
}
