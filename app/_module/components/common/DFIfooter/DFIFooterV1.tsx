'use client';

import { footerItems } from '@/app/_module/config/constants/globals';
import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';
import { FC, Fragment, useEffect, useRef } from 'react';
import {
  Colon,
  CurlyBraces,
  DevfestLogo,
  Facebook,
  Groundnut,
  Instagram,
  Linkedin,
  SemiColon,
  SplittedTag,
} from '../../icons';
import MenuLink from '../../menulink';
import { Button } from '../../ui/button';
import { footerClass as styles } from './DFIfooter.classes';
import XIcon from '@/public/X_icon.svg';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const DFIFooterV1: FC = () => {
  const { frameOne, frameTwo, frameThree } = footerItems;
  const pathname = usePathname();
  const adminRoute = '/admin';

  const controls = useAnimation();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dropInVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <Fragment>
      {pathname !== adminRoute && (
        <footer>
          <div
            className="px-[41px] py-[57px] bg-red"
            style={{ containerType: 'inline-size' }}
          >
            <p className="w-fit mx-auto font-bold text-white text-[14cqw] leading-[120%] whitespace-nowrap">
              DEVFEST 2026
            </p>
          </div>
          <div className={styles.footer} ref={footerRef}>
            <div className={styles.wrapper}>
              <div className={styles.logoContainer}>
                <DevfestLogo variant="dark" />
              </div>
              <div className={styles.middle}>
                <p className={styles.location}>
                  Devfest is taking place on November 20th and 21st, 2026, 8AM
                  Prompt at Jogor Center, No. 1 Harvester Drive, Liberty Road,
                  New GRA, Ibadan
                </p>
                <div className={styles.menuWrapper}>
                  <ul className={styles.menu}>
                    {frameOne.map(({ label, slur }) => (
                      <MenuLink key={slur} label={label} slur={slur} />
                    ))}
                  </ul>
                  <ul className={styles.menu}>
                    {frameTwo.map(({ label, slur }) => (
                      <MenuLink key={slur} label={label} slur={slur} />
                    ))}
                  </ul>
                  <ul className={styles.menu}>
                    {frameThree.map(({ label, slur }) => (
                      <MenuLink key={slur} label={label} slur={slur} />
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={styles.socialsCopyright}>
                  <div className={styles.socialsWrapper}>
                    <p className={styles.pSm}>Connect with us on our Social</p>
                    <ul className={styles.socials}>
                      <li>
                        <a
                          href="https://www.instagram.com/gdgibadan"
                          target="_blank"
                          className={styles.socialLink}
                        >
                          <Instagram
                            color="fill-white"
                            fill="fill-social-dark"
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/company/gdg-ibadan"
                          target="_blank"
                          className={styles.socialLink}
                        >
                          <Linkedin
                            color="fill-white"
                            fill="fill-social-dark"
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://web.facebook.com/gdgibadan1"
                          target="_blank"
                          className={styles.socialLink}
                        >
                          <Facebook
                            color="fill-white"
                            fill="fill-social-dark"
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://x.com/gdgibadan"
                          target="_blank"
                          className={styles.socialLink}
                        >
                          <Image
                            src={XIcon}
                            alt="XIcon"
                            className="rounded-lg"
                          />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <p className={styles.pSm}>
                    @Devfest{new Date().getFullYear()}. All Right Reserved
                  </p>
                  <p className={`${styles.pSm} opacity-60 text-xs`}>
                    DevFest Ibadan 2026, POWERED BY ABIT TECHNOLOGY HUB
                  </p>
                </div>
                {/* <Link href="https://dev2024-game.vercel.app/" target="_blank">
                  <Button className={styles.btn}>Play Puzzle Game</Button>
                </Link> */}
                <Link
                  href="/tickets"
                  className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                  <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                    Get Ticket
                  </span>
                </Link>
              </div>
            </div>
            <motion.div
              className="doodles flex justify-between items-end"
              initial="hidden"
              animate={controls}
              variants={containerVariants}
            >
              <motion.div
                className="doodleContainer w-full lg:w-[240px]"
                variants={dropInVariants}
              >
                <CurlyBraces fill="fill-pastel-green" stroke="stroke-black" />
              </motion.div>
              <motion.div
                className="doodleContainer w-full lg:w-[240px] "
                variants={dropInVariants}
              >
                <Colon fill="fill-core-blue" stroke="stroke-black" />
              </motion.div>
              <motion.div
                className="doodleContainer w-full lg:w-[525px]"
                variants={dropInVariants}
              >
                <Groundnut fill="fill-pastel-red" stroke="stroke-black" />
              </motion.div>
              <motion.div
                className="doodleContainer w-full lg:w-[245px]"
                variants={dropInVariants}
              >
                <SemiColon fill="fill-core-yellow" stroke="stroke-black" />
              </motion.div>
              <motion.div
                className="doodleContainer w-full lg:w-[344px]"
                variants={dropInVariants}
              >
                <SplittedTag fill="fill-halftone-red" stroke="stroke-black" />
              </motion.div>
            </motion.div>
          </div>
        </footer>
      )}
    </Fragment>
  );
};

export default DFIFooterV1;
