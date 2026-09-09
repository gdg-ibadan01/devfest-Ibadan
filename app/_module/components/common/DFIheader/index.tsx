'use client';

import { menuItems } from '@/app/_module/config/constants/globals';
import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import Cancel from '../../icons/Cancel.svg';
import DevfestLogo from '../../icons/DevfestLogo.svg';
import Hamburger from '../../icons/Hamburger.svg';
import MenuLink from '../../menulink';

import Image from 'next/image';
import { headerClass as styles } from './DFIheader.classes';

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
        <Link href="/" className={styles.logoContainer}>
          {/* <DevfestLogo fill="fill-black" stroke="stroke-black" /> */}
          <Image src={DevfestLogo} alt="DevfestLogo" />
        </Link>
        {isTablet && (
          <nav className="lg:block">
            <ul className={styles.headerMenu}>
              {menuItems.map(({ label, slur }) => (
                <div key={slur} onClick={showMenuFunc}>
                  <MenuLink key={slur} label={label} slur={slur} />
                </div>
              ))}
              <Link
                href="/tickets/buy"
                className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                  Get Ticket
                </span>
              </Link>
            </ul>
          </nav>
        )}
        {showMenu && (
          <nav className={styles.showMenu}>
            <ul className={styles.headerMenu}>
              {menuItems.map(({ label, slur }) => (
                <div key={slur} onClick={showMenuFunc}>
                  <MenuLink key={slur} label={label} slur={slur} />
                </div>
              ))}
              <Link
                href="/tickets/buy"
                className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                  Get Ticket
                </span>
              </Link>
            </ul>
          </nav>
        )}
        <button
          aria-label={!showMenu ? 'menu' : 'close'}
          className={styles.toggleMenuBtn}
          onClick={showMenuFunc}
        >
          {!showMenu ? (
            // <Hamburger color="fill-black" />
            <Image src={Hamburger} alt="Hamburger" />
          ) : (
            // 'test'
            <Image src={Cancel} alt="Cancel" />
            // <Cancel color="stroke-black" />
          )}
        </button>
      </div>
    </header>
  );
};

export default DFIHeader;
