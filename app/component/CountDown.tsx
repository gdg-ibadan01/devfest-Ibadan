'use client';
import { useEffect, useState } from 'react';
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

const CountDown = () => {
  // Define the target date (December 2nd, 2023)
  const targetDate = new Date('2026-11-28T08:00:00Z').getTime();

  // Initialize state variables for the countdown values
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatNum = (num: number) => {
    if (!mounted) return '00';
    return num.toString().padStart(2, '0');
  };

  useEffect(() => {
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

    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [targetDate]);
  return (
    <div className="bg-pastel-red">
      <div className="w-full md:max-w-[1500px] mx-auto ">
        <div className="container flex flex-col md:flex-row justify-between items-center py-48 gap-5">
          <div className="w-full md:w-1/3 ">
            <h1 className="font-bold text-3xl text-center md:text-left md:text-6xl">
              We&apos;ll see you in
            </h1>
          </div>
          <div className="w-full md:w-fit flex flex-row gap-2 md:gap-3">
            <div className="py-2 px-4 md:py-5 md:px-7 rounded-2xl bg-halftone-blue flex flex-col items-center justify-center">
              <div className="font-bold text-3xl md:text-5xl flex flex-row justify-center items-center leading-none h-[1em]">
                {formatNum(days)
                  .split('')
                  .map((digit, idx) => (
                    <AnimatedDigit key={idx} digit={digit} />
                  ))}
              </div>
              <span className="font-thin text-sm md:text-2xl mt-1 md:mt-2">
                Days
              </span>
            </div>
            <div className="py-2 px-4 md:py-5 md:px-7 rounded-2xl bg-halftone-red flex flex-col items-center justify-center">
              <div className="font-bold text-3xl md:text-5xl flex flex-row justify-center items-center leading-none h-[1em]">
                {formatNum(hours)
                  .split('')
                  .map((digit, idx) => (
                    <AnimatedDigit key={idx} digit={digit} />
                  ))}
              </div>
              <span className="font-thin text-sm md:text-2xl mt-1 md:mt-2">
                Hours
              </span>
            </div>
            <div className="py-2 px-4 md:py-5 md:px-7 rounded-2xl bg-halftone-green flex flex-col items-center justify-center">
              <div className="font-bold text-3xl md:text-5xl flex flex-row justify-center items-center leading-none h-[1em]">
                {formatNum(minutes)
                  .split('')
                  .map((digit, idx) => (
                    <AnimatedDigit key={idx} digit={digit} />
                  ))}
              </div>
              <span className="font-thin text-sm md:text-2xl mt-1 md:mt-2">
                Minutes
              </span>
            </div>
            <div className="py-2 px-4 md:py-5 md:px-7 rounded-2xl bg-halftone-yellow flex flex-col items-center justify-center">
              <div className="font-bold text-3xl md:text-5xl flex flex-row justify-center items-center leading-none h-[1em]">
                {formatNum(seconds)
                  .split('')
                  .map((digit, idx) => (
                    <AnimatedDigit key={idx} digit={digit} />
                  ))}
              </div>
              <span className="font-thin text-sm md:text-2xl mt-1 md:mt-2">
                Seconds
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountDown;
