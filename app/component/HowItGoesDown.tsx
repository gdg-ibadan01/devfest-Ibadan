'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface EventCard {
  eventTag: string;
  dateTag: string;
  title: string;
  label: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  isExternal?: boolean;
  disabled?: boolean;
  colorScheme: 'green' | 'blue' | 'red';
}

const themeStyles = {
  green: {
    border: 'border-[#34A853]',
    headerBg: 'bg-[#D5F5D0]',
    accentText: 'text-[#34A853]',
  },
  blue: {
    border: 'border-[#4285F4]',
    headerBg: 'bg-[#D2E3FC]',
    accentText: 'text-[#4285F4]',
  },
  red: {
    border: 'border-[#EA4335]',
    headerBg: 'bg-[#FCDEDD]',
    accentText: 'text-[#EA4335]',
  },
};

const eventCards: EventCard[] = [
  {
    eventTag: 'DEVFEST IBADAN 2026.',
    dateTag: 'OCT-NOV 2026',
    title: 'PreDevFest Series',
    label: 'LEAD-IN EXPERIENCE',
    description:
      '3 weekends of workshops, talks, and community sessions leading up to the main event (1 week gap between each).',
    buttonText: 'Coming soon',
    buttonHref: '/tickets/buy',
    colorScheme: 'green',
    disabled: true,
  },
  {
    eventTag: 'DEVFEST IBADAN 2026.',
    dateTag: '20 NOV 2026',
    title: 'Virtual Event',
    label: 'REMOTE ACCESS',
    description:
      'Join us online the Friday before D-Day. Keynotes, panels, and networking — from anywhere in the world.',
    buttonText: 'Coming soon',
    buttonHref: '/tickets/buy',
    disabled: true,
    colorScheme: 'blue',
  },
  {
    eventTag: 'DEVFEST IBADAN 2026.',
    dateTag: '21 NOV 2026',
    title: 'Physical Event',
    label: 'MAIN EVENT',
    description:
      'The main event! A full day of talks across all tracks, workshops, codelabs, sponsor booths, networking, and swag — live at Kakanfo Inn, Ibadan.',
    buttonText: 'Register here',
    buttonHref: '/tickets/buy',

    colorScheme: 'red',
  },
];

const HowItGoesDown: FC = () => {
  return (
    <section className="w-full bg-white pb-28 md:pb-64 lg:pb-96 lg:pt-28">
      <div className="w-full md:max-w-[1500px] mx-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-24">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-black text-3xl sm:text-4xl md:text-5xl text-black tracking-tight font-grotesk"
            >
              How It All Goes Down
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 sm:mt-4 text-sm sm:text-base text-[#4B5563] leading-relaxed font-normal mb-10"
            >
              DevFest Ibadan 2026 is more than one day. Here is how the experience
              unfolds across the PreDevFest Series, Virtual Event, and Physical
              Event.
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mx-auto mt-16 sm:mt-20">
            {eventCards.map((card, index) => {
              const theme = themeStyles[card.colorScheme];

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`border-2 ${theme.border} rounded-[16px] overflow-hidden bg-white flex flex-col shadow-sm hover:shadow-md transition-shadow`}
                >
                  {/* Card Header */}
                  <div className={`${theme.headerBg} py-10 px-6 flex flex-col gap-4`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider text-black">
                        {card.eventTag}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-[100px] border border-black text-[10px] sm:text-[11px] font-mono font-bold text-black bg-white/70 backdrop-blur-xs uppercase whitespace-nowrap">
                        {card.dateTag}
                      </span>
                    </div>
                    <h3 className="font-medium text-2xl sm:text-3xl md:text-[32px] text-[#111111] tracking-[0%] leading-[100%] font-grotesk">
                      {card.title}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="py-9 px-6 flex flex-col justify-between flex-1">
                    <div>
                      <span
                        className={`font-mono font-bold text-xs uppercase tracking-wider ${theme.accentText}`}
                      >
                        {card.label}
                      </span>
                      <p className="text-xs sm:text-sm text-[#4B5563] mt-2 leading-relaxed font-sans">
                        {card.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-10">
                      {card.disabled ? (
                        <span
                          className="relative inline-flex p-[2px] rounded-[100px] overflow-hidden cursor-not-allowed opacity-50"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px]" />
                          <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] text-white text-sm sm:text-base font-semibold tracking-wide flex items-center justify-center">
                            {card.buttonText}
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={card.buttonHref}
                          target={card.isExternal ? '_blank' : undefined}
                          rel={card.isExternal ? 'noopener noreferrer' : undefined}
                          className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                          <span className="relative px-[20px] lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                            {card.buttonText}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItGoesDown;
