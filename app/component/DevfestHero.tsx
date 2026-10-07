'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSmoothScroll } from '@/utils/scroll';
import { TARGET_DATE } from '@/app/_module/data/devfest-hero.data';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DevfestHero: FC = () => {
  const { handleScrollTo } = useSmoothScroll();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const difference = TARGET_DATE - Date.now();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUnit = (value: number) => {
    if (!mounted) return '00';
    return value.toString().padStart(2, '0');
  };

  return (
    <section className="relative w-full bg-[#EDF5FB] pt-[130px] sm:pt-[150px] lg:pt-[175px] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* Top Pills Row - Aligned right */}
        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-[100px] border border-black text-[11px] sm:text-xs font-mono font-bold tracking-wider text-black bg-white/90 uppercase">
            KAKANFO INN &amp; CONFERENCE CENTRE
          </span>
          <span className="inline-flex items-center px-4 py-1.5 rounded-[100px] border border-black text-[11px] sm:text-xs font-mono font-bold tracking-wider text-black bg-white/90 uppercase">
            21ST NOV 2026
          </span>
        </div>

        {/* 2-Column Content Grid on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* Left Column: Heading, Subtitle, CTAs & Desktop Illustration */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="font-black font-grotesk text-[42px] sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] leading-[95%] tracking-tight text-black"
              >
                DEVFEST
                <br />
                IBADAN{' '}
                <span className="inline-block whitespace-nowrap">
                  <span className="text-[#4285F4]">2</span>
                  <span className="text-[#EA4335]">0</span>
                  <span className="text-[#FBBC04]">2</span>
                  <span className="text-[#34A853]">6</span>
                  <span className="text-[#4285F4]">.</span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                className="my-5 sm:my-6 text-sm sm:text-base md:text-lg text-[#4B5563] max-w-lg leading-relaxed font-sans"
              >
                Ibadan Nigeria&apos;s biggest developer conference. Early bird
                tickets from ₦5,000.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-5"
              >
                {/* View ticket tiers */}
                <Link
                  href="#tickets"
                  onClick={handleScrollTo('#tickets')}
                  className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                  <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                    View ticket tiers
                  </span>
                </Link>

                {/* Buy swags */}
                <Link
                  href="https://selar.co/m/gdg-ibadan1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                  <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-white group-hover:bg-neutral-50 text-black text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                    Buy swags
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Attendees Illustration: Desktop only (anchored inside left column) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="hidden lg:block mt-8 lg:-mt-[80px] w-full max-w-[500px] sm:max-w-[560px] md:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] lg:-mb-[38%]"
            >
              <Image
                src="/hero_attendees.png"
                alt="DevFest Ibadan Attendees"
                width={740}
                height={538}
                priority
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
              />
            </motion.div>
          </div>

          {/* Right Column: Peach Countdown Box */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-[460px] border border-black rounded-[24px] p-5 sm:p-6 bg-[#FCD5CE] shadow-sm"
            >
              {/* Header: Title + BEST VALUE badge */}
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-black font-grotesk tracking-tight">
                  Early Bird Active
                </h2>
                <span className="bg-[#EA4335] text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-[100px] uppercase tracking-wider shrink-0">
                  BEST VALUE
                </span>
              </div>

              {/* Subtext */}
              <p className="mt-2 text-xs sm:text-[13px] text-[#4B5563] leading-relaxed">
                Secure your ticket at ₦5,000 - first 300 only. Closes October
                16, 2026.
              </p>

              {/* White Countdown Box */}
              <div className="mt-4 sm:mt-5 border border-black rounded-[18px] bg-white p-4 sm:p-5">
                <h3 className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-black uppercase mb-3">
                  COUNTDOWN TO DEVFEST IBADAN
                </h3>

                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {/* Days */}
                  <div className="border border-black rounded-xl py-3 px-1 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-black font-grotesk tabular-nums leading-none">
                      {formatUnit(timeLeft.days)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#6B7280] uppercase mt-1.5">
                      DAYS
                    </span>
                  </div>

                  {/* Hours */}
                  <div className="border border-black rounded-xl py-3 px-1 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-black font-grotesk tabular-nums leading-none">
                      {formatUnit(timeLeft.hours)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#6B7280] uppercase mt-1.5">
                      HOURS
                    </span>
                  </div>

                  {/* Mins */}
                  <div className="border border-black rounded-xl py-3 px-1 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-black font-grotesk tabular-nums leading-none">
                      {formatUnit(timeLeft.minutes)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#6B7280] uppercase mt-1.5">
                      MINS
                    </span>
                  </div>

                  {/* Secs */}
                  <div className="border border-black rounded-xl py-3 px-1 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-black font-grotesk tabular-nums leading-none">
                      {formatUnit(timeLeft.seconds)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#6B7280] uppercase mt-1.5">
                      SECS
                    </span>
                  </div>
                </div>
              </div>

              {/* BUY NOW Button */}
              <Link
                href="/tickets/buy"
                className="mt-4 w-full py-3.5 px-4 rounded-[100px] border border-black bg-white hover:bg-neutral-50 text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-widest text-center transition-colors flex items-center justify-center shadow-xs active:scale-[0.99]"
              >
                BUY NOW
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Attendees Illustration: Mobile/Tablet only (rendered below countdown card, grounded at bottom of hero section) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="block lg:hidden w-full max-w-[500px] sm:max-w-[560px] mx-auto mt-8 sm:mt-10 -mb-[26%] sm:-mb-[20%]"
        >
          <Image
            src="/hero_attendees.png"
            alt="DevFest Ibadan Attendees"
            width={740}
            height={538}
            priority
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DevfestHero;
