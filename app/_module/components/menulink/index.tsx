import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import menulinkClasses from './menulink.classes';

interface MenuLinkProps {
  label: string;
  slur: string;
}

const MenuLink: FC<MenuLinkProps> = ({ slur, label }) => {
  const pathname = usePathname();
  const splittedPathname = pathname.split('/');
  const currentPath = splittedPathname[splittedPathname.length - 1];

  const cleanSlur = slur.replace(/^\//, '');
  const isInternal =
    slur.startsWith('/') ||
    [
      'agenda',
      'speakers',
      'organizers',
      'schedule',
      'sponsors',
      'team',
      'tickets',
      'rsvp',
    ].indexOf(cleanSlur) > -1;

  return (
    <li className={menulinkClasses.list}>
      {isInternal ? (
        <Link
          href={`/${cleanSlur}`}
          aria-label={label}
          className={`${menulinkClasses.link} ${
            currentPath === cleanSlur
              ? 'font-semibold text-[14px]'
              : 'font-normal text-[14px]'
          }`}
        >
          {label}
        </Link>
      ) : slur === 'contact-us' ? (
        <a
          href="mailto:info@gdgibadan.com"
          target="_blank"
          aria-label={label}
          className={menulinkClasses.link}
        >
          {label}
        </a>
      ) : (
        <Link
          href={slur}
          target="_blank"
          aria-label={label}
          className={menulinkClasses.link}
        >
          {label}
        </Link>
      )}
    </li>
  );
};

export default MenuLink;
