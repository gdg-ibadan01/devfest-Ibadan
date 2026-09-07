'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TARGET_DATE = new Date('2026-11-26T08:00:00+01:00').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DevfestHero: FC = () => {
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
    <section className="relative w-full bg-[#EEF6FC] pt-[150px] lg:pt-[210px] overflow-hidden">
      <div className="w-full md:max-w-[1500px] mx-auto ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-24">
          {/* Top Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Heading, Description, CTA */}
            <div className="lg:col-span-7 z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="font-black font-grotesk text-5xl sm:text-6xl md:text-7xl lg:text-[90px] xl:text-[88px] leading-[95%] tracking-tight text-black"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="mt-6 text-base sm:text-lg text-[#4B5563] max-w-xl leading-[160%] font-normal font-inter"
              >
                The biggest developer gathering in South-West Nigeria is back.
                One day. Four tracks. Thousands of builders shaping tomorrow
                with innovative cloud, AI, web, and mobile technologies.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="mt-[20px] sm:mt-10"
              >
                <Link
                  href="/tickets"
                  className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  {/* Google Multi-Color Gradient Ring */}
                  <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                  {/* Inner Button */}
                  <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                    Get Ticket
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Location & Date Badges + Countdown Box */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end w-full z-10 mt-[40px] md:mt-0">
              {/* Meta Pills */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-wrap gap-2 sm:gap-3 items-center justify-start lg:justify-end mb-4 sm:mb-5 w-full"
              >
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-[100px] border border-black text-[11px] sm:text-xs font-mono font-bold tracking-wider text-black bg-white/70 backdrop-blur-xs uppercase">
                  KAKANFO INN &amp; CONFERENCE CENTRE
                </span>
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-[100px] border border-black text-[11px] sm:text-xs font-mono font-bold tracking-wider text-black bg-white/70 backdrop-blur-xs uppercase">
                  26 NOV 2026
                </span>
              </motion.div>

              {/* Countdown Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="w-full max-w-md border border-black rounded-2xl p-4 sm:p-5 bg-white shadow-sm"
              >
                <h2 className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-black uppercase mb-3 text-left">
                  COUNTDOWN TO DEVFEST IBADAN
                </h2>

                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {/* Days */}
                  <div className="border border-black rounded-xl py-2 sm:py-3 px-1.5 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-mono tabular-nums leading-none">
                      {formatUnit(timeLeft.days)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-gray-500 uppercase mt-1.5">
                      DAYS
                    </span>
                  </div>

                  {/* Hours */}
                  <div className="border border-black rounded-xl py-2 sm:py-3 px-1.5 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-mono tabular-nums leading-none">
                      {formatUnit(timeLeft.hours)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-gray-500 uppercase mt-1.5">
                      HOURS
                    </span>
                  </div>

                  {/* Mins */}
                  <div className="border border-black rounded-xl py-2 sm:py-3 px-1.5 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-mono tabular-nums leading-none">
                      {formatUnit(timeLeft.minutes)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-gray-500 uppercase mt-1.5">
                      MINS
                    </span>
                  </div>

                  {/* Secs */}
                  <div className="border border-black rounded-xl py-2 sm:py-3 px-1.5 text-center bg-white flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-mono tabular-nums leading-none">
                      {formatUnit(timeLeft.seconds)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-gray-500 uppercase mt-1.5">
                      SECS
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Attendees Illustration: Bottom 50% hangs outside the blue hero section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="relative w-full flex justify-center lg:justify-end mt-8 lg:-mt-4 xl:-mt-8 z-10"
          >
            <div className="w-full max-w-[500px] sm:max-w-[560px] md:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] -mb-[36%] md:-mb-[21%]">
              <Image
                src="/hero_attendees.png"
                alt="Devfest Ibadan Attendees"
                width={740}
                height={538}
                priority
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DevfestHero;
