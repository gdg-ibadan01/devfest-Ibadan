'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export type CardTheme = 'green' | 'red' | 'blue' | 'yellow';

export interface SwagTicketCardProps {
  title: string;
  category: string;
  description: string;
  perks: string[];
  buttonText: string;
  buttonHref: string;
  isExternal?: boolean;
  eventTag?: string;
  dateTag?: string;
  colorScheme?: CardTheme;
  delay?: number;
  className?: string;
}

const themeStyles: Record<
  CardTheme,
  {
    border: string;
    headerBg: string;
    accentText: string;
    checkBg: string;
  }
> = {
  green: {
    border: 'border-[#34A853]',
    headerBg: 'bg-[#D5F5D0]',
    accentText: 'text-[#34A853]',
    checkBg: 'bg-[#34A853]',
  },
  red: {
    border: 'border-[#EA4335]',
    headerBg: 'bg-[#FCDEDD]',
    accentText: 'text-[#EA4335]',
    checkBg: 'bg-[#EA4335]',
  },
  blue: {
    border: 'border-[#4285F4]',
    headerBg: 'bg-[#D2E3FC]',
    accentText: 'text-[#4285F4]',
    checkBg: 'bg-[#4285F4]',
  },
  yellow: {
    border: 'border-[#FBBC04]',
    headerBg: 'bg-[#FEF7E0]',
    accentText: 'text-[#FBBC04]',
    checkBg: 'bg-[#FBBC04]',
  },
};

export const SwagTicketCard: FC<SwagTicketCardProps> = ({
  title,
  category,
  description,
  perks,
  buttonText,
  buttonHref,
  isExternal = false,
  eventTag = 'DEVFEST IBADAN 2026.',
  dateTag = '26 NOV 2026',
  colorScheme = 'green',
  delay = 0,
  className = '',
}) => {
  const currentTheme = themeStyles[colorScheme] ?? themeStyles.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`border-2 ${currentTheme.border} rounded-[14px] md:rounded-[28px] overflow-hidden bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Card Header */}
      <div className={`${currentTheme.headerBg} p-16 md:p-32`}>
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-black">
            {eventTag}
          </span>
          <span className="inline-flex items-center px-3.5 py-1 rounded-[100px] border border-black text-[11px] font-mono font-bold text-black bg-white/70 backdrop-blur-xs uppercase">
            {dateTag}
          </span>
        </div>
        <h3 className="font-semibold text-3xl sm:text-4xl text-[#111111] mt-6 tracking-[0%] leading-[100%] font-grotesk">
          {title}
        </h3>
      </div>

      {/* Card Body */}
      <div className="p-16 md:p-32 flex flex-col justify-between flex-1">
        <div>
          <span
            className={`font-mono font-bold text-xs uppercase tracking-wider ${currentTheme.accentText}`}
          >
            {category}
          </span>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-2 mb-6 leading-relaxed font-sans">
            {description}
          </p>

          {/* Perks List */}
          <ul className="space-y-3.5 sm:space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <span
                  className={`w-4 h-4 rounded-full ${currentTheme.checkBg} text-white flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span className="text-xs sm:text-sm text-[#1F2937] font-medium leading-tight">
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-2">
          <Link
            href={buttonHref}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="group relative flex w-full p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
            <span className="relative w-full py-3.5 sm:py-4 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
              {buttonText}
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SwagTicketCard;
