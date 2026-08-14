'use client';

import { cn } from '@/app/_module/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DevfestLogo from '../../icons/DevfestLogo.svg';
import { adminSidenavClass as styles } from './AdminSidenav.classes';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Home from '../../icons/Home';
import Ticket from '../../icons/Ticket';
import DiscountReferral from '../../icons/DiscountReferral';
import RolesAndPermissions from '../../icons/RolesAndPermissions';
import Attendees from '../../icons/Attendees';
import AuditLog from '../../icons/AuditLog';
import Logout from '../../icons/Logout';

const navItems = [
  { label: 'Home', href: '/admin/home', icon: Home },
  { label: 'Ticket', href: '/admin/ticket', icon: Ticket },
  {
    label: 'Discount & Referral',
    href: '/admin/discount-referral',
    icon: DiscountReferral,
  },
  {
    label: 'Roles & Permission',
    href: '/admin/roles-permission',
    icon: RolesAndPermissions,
  },
  { label: 'Attendees', href: '/admin/attendees', icon: Attendees },
  { label: 'Audit Log', href: '/admin/audit-log', icon: AuditLog },
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
              <Icon />
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
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })}

          <button className={cn(styles.navItem, 'mt-1')} type="button">
            <Logout />
            <span>Log out</span>
          </button>
        </div>

        <div className={styles.footer}>
          <div className={styles.profile}>
            <Avatar>
              {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
              <AvatarFallback className="bg-[#4285F4] text-white">
                ME
              </AvatarFallback>
            </Avatar>
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
