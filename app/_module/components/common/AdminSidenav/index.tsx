'use client';

import { cn } from '@/app/_module/lib/utils';
import {
  BadgePercent,
  Home,
  LogOut,
  ShieldCheck,
  Ticket,
  UserRound,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DevfestLogo from '../../icons/DevfestLogo.svg';
import { adminSidenavClass as styles } from './AdminSidenav.classes';

const navItems = [
  { label: 'Home', href: '/admin/home', icon: Home },
  { label: 'Ticket', href: '/admin/ticket', icon: Ticket },
  {
    label: 'Discount & Referral',
    href: '/admin/discount-referral',
    icon: BadgePercent,
  },
  {
    label: 'Roles & Permission',
    href: '/admin/roles-permission',
    icon: ShieldCheck,
  },
  { label: 'Attendees', href: '/admin/attendees', icon: UserRound },
  { label: 'Audit Log', href: '/admin/audit-log', icon: UsersRound },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === '/admin/home') {
    return pathname === '/admin' || pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const AdminSidenav = () => {
  const pathname = usePathname();

  return (
    <aside className={styles.aside}>
      <div className={styles.logoPanel}>
        <Link href="/admin/home" className={styles.logoLink}>
          <Image src={DevfestLogo} alt="DevFest Ibadan" priority />
        </Link>
      </div>

      <nav className={styles.mobileNav} aria-label="Admin navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActivePath(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                styles.mobileNavItem,
                active && styles.mobileActiveNavItem
              )}
            >
              <Icon className={styles.icon} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <nav className={styles.desktopNav} aria-label="Admin navigation">
        <div className={styles.navList}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActivePath(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(styles.navItem, active && styles.activeNavItem)}
              >
                <Icon className={styles.icon} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}

          <button className={cn(styles.navItem, 'mt-1')} type="button">
            <LogOut className={styles.icon} strokeWidth={1.8} />
            <span>Log out</span>
          </button>
        </div>

        <div className={styles.footer}>
          <div className={styles.profile}>
            <div className={styles.avatar}>ME</div>
            <div>
              <p className={styles.profileName}>Mary Esivue</p>
              <p className={styles.profileRole}>Super Admin</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidenav;
