'use client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedDigit = ({ digit }: { digit: string }) => {
  return (
    <span className="relative inline-flex h-[1em] w-[0.55em] sm:w-[0.6em] overflow-hidden justify-center items-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center font-bold"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const DevfestHero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Target Date: November 28th, 2026 at 8:00 AM UTC
  const targetDate = new Date('2026-11-28T08:00:00Z').getTime();

  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateCountdown = () => {
      const currentDate = Date.now();
      const timeDifference = targetDate - currentDate;

      if (timeDifference <= 0) {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      } else {
        const oneSecond = 1000;
        const oneMinute = oneSecond * 60;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;

        setDays(Math.floor(timeDifference / oneDay));
        setHours(Math.floor((timeDifference % oneDay) / oneHour));
        setMinutes(Math.floor((timeDifference % oneHour) / oneMinute));
        setSeconds(Math.floor((timeDifference % oneMinute) / oneSecond));
      }
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [targetDate]);

  const formatNum = (num: number) => {
    if (!mounted) return '00';
    return String(num).padStart(2, '0');
  };

  // Framer motion entry animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 12 },
    },
  };

  const countdownVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 12, delay: 0.6 },
    },
  };

  return (
    <main
      ref={sectionRef}
      className="relative min-h-screen pt-[130px] pb-[100px] bg-white overflow-hidden flex flex-col items-center justify-center z-10"
      style={{
        backgroundImage: "url('/bg_homehero.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom center',
        backgroundSize: 'cover',
      }}
    >
      {/* Main Content Area */}
      <motion.div
        className="w-full max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Title */}
        <motion.h1
          variants={textVariants}
          className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#060606] leading-[1.1] flex flex-wrap justify-center items-center gap-x-3 md:gap-x-5"
        >
          <span className="text-[#4285F4]">
            {'{'}Devfest{'}'}
          </span>
          <span>Ibadan 2026</span>
        </motion.h1>

        {/* Animated Description Paragraph */}
        <motion.p
          variants={textVariants}
          className="text-[#4D4D4D] text-sm sm:text-base md:text-lg lg:text-xl max-w-[900px] mx-auto leading-relaxed"
        >
          Be a part of the largest tech event in Ibadan where tech enthusiasts
          come together to discover breakthrough Ideas, Connect with like minds
          and unlock the future of technology
        </motion.p>

        {/* Animated Action Buttons */}
        <motion.div
          variants={buttonContainerVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-fit mx-auto pt-2"
        >
          <motion.div variants={buttonVariants} className="w-full sm:w-auto">
            <Link
              href="/ticket"
              className="w-full sm:w-auto bg-[#1e1e1e] text-white hover:bg-[#4285f4] border border-[#1e1e1e] hover:border-[#4285f4] rounded-[100px] py-[33px] px-[106px] flex items-center justify-center gap-2 font-medium text-base transition-all group shadow-sm"
            >
              <span>Get Ticket</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <motion.div variants={buttonVariants} className="w-full sm:w-auto">
            <Link
              href="https://sessionize.com/devfest-ibadan-2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white text-[#1e1e1e] hover:bg-[#f7f7f7] border border-[#1e1e1e] rounded-[100px] py-[33px] px-[106px] font-medium text-base transition-all shadow-sm"
            >
              Apply to Speak
            </Link>
          </motion.div>
        </motion.div>

        {/* Premium 3D Countdown Box */}
        <motion.div
          variants={countdownVariants}
          className="w-full max-w-[800px] mx-auto pt-6 sm:pt-10"
        >
          <div className="bg-[#c3ecf6] border-[3px] border-black rounded-[4px] p-3 sm:p-5 md:p-6 shadow-[8px_8px_0px_#57caff]">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              {[
                { label: 'DAYS', value: days },
                { label: 'HOURS', value: hours },
                { label: 'MINS', value: minutes },
                { label: 'SECS', value: seconds },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-[3px] border-black flex flex-col items-center justify-center py-3 sm:py-6 aspect-[1.1] sm:aspect-square w-full"
                >
                  <div className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-none flex flex-row items-center justify-center">
                    {formatNum(item.value)
                      .split('')
                      .map((digit, dIdx) => (
                        <AnimatedDigit key={dIdx} digit={digit} />
                      ))}
                  </div>
                  <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-bold text-[#808080] tracking-wider mt-1 sm:mt-2.5 leading-none">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default DevfestHero;
