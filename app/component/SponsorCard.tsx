'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export interface Sponsor {
  name: string;
  website: string;
  logo: string;
  width?: number;
  height: number;
  description?: string;
}

export interface SponsorCardProps {
  sponsor: Sponsor;
  isFeatured?: boolean;
  className?: string;
  as?: 'div' | 'li';
}

export const SponsorCard = ({
  sponsor,
  isFeatured = false,
  className = '',
  as: Component = 'div',
}: SponsorCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const websiteUrl = sponsor.website.startsWith('http')
    ? sponsor.website
    : `https://${sponsor.website}`;
  const logoSrc = sponsor.logo.startsWith('/')
    ? sponsor.logo
    : `/sponsors/${sponsor.logo}`;

  return (
    <Component
      className={`${isFeatured ? 'bg-[#eef6fc]' : 'bg-white'} ${className}`.trim()}
    >
      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${sponsor.name} (opens in a new tab)`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group flex h-[271px] flex-col justify-between px-[32px] pb-[17px] pt-[32px] transition-colors duration-150 ease-out hover:bg-core-blue/10 focus-visible:bg-core-blue/10 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-core-blue"
      >
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <Image
            src={logoSrc}
            alt={sponsor.name}
            width={Math.round(sponsor?.width ?? 0)}
            height={Math.round(sponsor.height)}
            unoptimized
            className="absolute max-w-none object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
            style={{
              width: sponsor?.width || 'auto',
              height: sponsor.height,
            }}
          />
          {sponsor.description && (
            <motion.p
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : shouldReduceMotion ? 0 : 6,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.18,
                ease: 'easeOut',
              }}
              className="pointer-events-none absolute bottom-1 left-0 right-0 line-clamp-3 text-[13px] sm:text-[14px] leading-[1.45] text-[#3c4043]"
            >
              {sponsor.description}
            </motion.p>
          )}
        </div>
        <div
          className={`flex items-center justify-between gap-[8px] border-t pt-[14px] ${
            isFeatured ? 'border-pastel-blue' : 'border-[#f0f0f0]'
          }`}
        >
          <span className="text-[14px] font-medium leading-[20px] text-[#111] group-hover:underline group-focus-visible:underline">
            {sponsor.website}
          </span>
          <Image
            src="/sponsors/arrow-up-right.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
          />
        </div>
      </a>
    </Component>
  );
};

export default SponsorCard;
