'use client';

import React from 'react';
import Image from 'next/image';
import { SPONSORS_2026, Sponsor } from '@/app/_module/data/sponsors.data';

interface SponsorsMarqueeProps {
  className?: string;
}

export const SponsorsMarquee: React.FC<SponsorsMarqueeProps> = ({
  className = '',
}) => {
  const baseSponsors: Sponsor[] = SPONSORS_2026;

  // Multiply items so the marquee track has sufficient length to loop seamlessly on all screen sizes
  const repeatCount = Math.max(6, Math.ceil(12 / (baseSponsors.length || 1)));
  const marqueeList: Sponsor[] = Array.from(
    { length: repeatCount },
    () => baseSponsors
  ).flat();

  return (
    <section
      aria-label="2026 Sponsors"
      className={`relative w-full overflow-hidden border-y border-[#1E293B] bg-white ${className}`.trim()}
    >
      <div className="flex w-full items-stretch">
        {/* Left Fixed Header Block (Cyan) */}
        <div className="relative z-20 flex h-[105px] w-[170px] shrink-0 flex-col items-center justify-center border-r border-[#1E293B] bg-[#B9F5FF] px-4 text-center select-none sm:h-[120px] sm:w-[220px] md:w-[240px]">
          <span className="font-grotesk text-3xl font-black leading-none text-[#0F172A] sm:text-4xl">
            2026
          </span>
          <span className="mt-1 font-grotesk text-xs font-bold tracking-wider text-[#0F172A] sm:text-sm md:text-base">
            SPONSORS
          </span>
        </div>

        {/* Marquee Infinite Conveyor */}
        <div className="group relative flex flex-1 overflow-hidden select-none">
          {/* Marquee Track 1 */}
          <div className="flex shrink-0 animate-marquee items-stretch group-hover:[animation-play-state:paused]">
            {marqueeList.map((sponsor, index) => {
              const websiteUrl = sponsor.website.startsWith('http')
                ? sponsor.website
                : `https://${sponsor.website}`;
              const logoSrc = sponsor.logo.startsWith('/')
                ? sponsor.logo
                : `/sponsors/${sponsor.logo}`;

              return (
                <a
                  key={`track1-${sponsor.name}-${index}`}
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${sponsor.name} (${sponsor.website})`}
                  className="flex h-[105px] w-[190px] shrink-0 items-center justify-center border-r border-[#1E293B] bg-white px-6 transition-colors duration-150 hover:bg-core-blue/5 sm:h-[120px] sm:w-[230px] md:w-[250px]"
                >
                  <div className="relative flex h-full w-full items-center justify-center">
                    <Image
                      src={logoSrc}
                      alt={sponsor.name}
                      width={Math.round(sponsor.width ?? 0)}
                      height={Math.round(sponsor.height)}
                      unoptimized
                      className="max-h-9 sm:max-h-11 w-auto max-w-[140px] sm:max-w-[170px] object-contain transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Marquee Track 2 (Duplicate for continuous seamless loop) */}
          <div
            aria-hidden="true"
            className="flex shrink-0 animate-marquee items-stretch group-hover:[animation-play-state:paused]"
          >
            {marqueeList.map((sponsor, index) => {
              const websiteUrl = sponsor.website.startsWith('http')
                ? sponsor.website
                : `https://${sponsor.website}`;
              const logoSrc = sponsor.logo.startsWith('/')
                ? sponsor.logo
                : `/sponsors/${sponsor.logo}`;

              return (
                <a
                  key={`track2-${sponsor.name}-${index}`}
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  title={`Visit ${sponsor.name} (${sponsor.website})`}
                  className="flex h-[105px] w-[190px] shrink-0 items-center justify-center border-r border-[#1E293B] bg-white px-6 transition-colors duration-150 hover:bg-core-blue/5 sm:h-[120px] sm:w-[230px] md:w-[250px]"
                >
                  <div className="relative flex h-full w-full items-center justify-center">
                    <Image
                      src={logoSrc}
                      alt={sponsor.name}
                      width={Math.round(sponsor.width ?? 0)}
                      height={Math.round(sponsor.height)}
                      unoptimized
                      className="max-h-9 sm:max-h-11 w-auto max-w-[140px] sm:max-w-[170px] object-contain transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsMarquee;
