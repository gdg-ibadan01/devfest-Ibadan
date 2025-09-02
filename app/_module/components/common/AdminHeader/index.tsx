'use client';

import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import DevfestLogo from '../../icons/DevfestLogo.svg';

import { headerClass as styles } from './DFIheader.classes';
import Image from 'next/image';
import NotificationBell from '../../icons/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DFIHeader = (): ReactNode => {
  const [showMenu, setShowMenu] = useState(false);
  const isTablet = useMediaQueryWatcher('(min-width: 1024px)');

  const showMenuFunc = (): void => {
    setShowMenu(!showMenu);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 100); // Change 100 to your desired scroll position
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={
        isScrolled
          ? 'lg:bg-white lg:bg-opacity-25 lg:backdrop-blur-lg ' + styles.header
          : 'lg:bg-transparent ' + styles.header
      }
    >
      <div className={styles.wrapper}>
        <Link href="/admin" className={styles.logoContainer}>
          <Image src={DevfestLogo} alt="DevfestLogo" />
        </Link>
        <div className={styles.rightSection}>
          <NotificationBell />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DFIHeader;
