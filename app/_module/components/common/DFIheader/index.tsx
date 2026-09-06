'use client';

import { menuItems } from '@/app/_module/config/constants/globals';
import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
// import { DevfestLogo } from '../../icons';
// import Cancel from '../../icons/Cancel';
// import Hamburger from '../../icons/Hamburger';
import Hamburger from '../../icons/Hamburger.svg';
import DevfestLogo from '../../icons/DevfestLogo.svg';
import Cancel from '../../icons/Cancel.svg';
import MenuLink from '../../menulink';

import { Button } from '../../ui/button';
import { headerClass as styles } from './DFIheader.classes';
import Image from 'next/image';

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
              <Link href="https://dev2024-game.vercel.app/" target="_blank">
                <Button className={styles.btn}>Play Puzzle Game</Button>
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
              <Link href="https://dev2024-game.vercel.app/" target="_blank">
                <Button className={styles.btn}>Play Puzzle Game</Button>
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
