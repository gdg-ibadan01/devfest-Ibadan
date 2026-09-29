'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import {
  SpeakerItem,
  defaultSpeakers,
} from '@/app/_module/data/meet-our-speakers.data';

export type { SpeakerItem };

const colorStyles: Record<SpeakerItem['colorScheme'], string> = {
  blue: 'bg-[#C3ECF6]',
  yellow: 'bg-[#FFE7A5]',
  green: 'bg-[#CCF6C5]',
  pink: 'bg-[#F8D8D8]',
};

interface MeetOurSpeakersProps {
  speakers?: SpeakerItem[];
}

export const MeetOurSpeakers: FC<MeetOurSpeakersProps> = ({
  speakers = defaultSpeakers,
}) => {
  return (
    <section
      id="speakers"
      className="w-full bg-[#F8F6E2] py-[80px] sm:py-[96px] lg:py-[112px] border-t border-[#E2DFD8] scroll-mt-[48px]"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black font-grotesk tracking-tight leading-tight">
              Meet Our Speakers
            </h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-[#4B5563] leading-relaxed font-sans">
              Industry leaders and innovators taking the stage.
            </p>
          </motion.div>

          {/* View all speakers button */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="shrink-0"
          >
            <Link
              href="/speakers"
              className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#EA4335] rounded-[100px] transition-opacity group-hover:opacity-90" />
              <span className="relative px-6 sm:px-[32px] py-3 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                View all speakers
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group border border-black rounded-[22px] overflow-hidden bg-white flex flex-col shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Speaker Photo */}
              <div className="relative w-full aspect-[4/3] bg-[#222224] border-b border-black overflow-hidden">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Speaker Details */}
              <div
                className={`${colorStyles[speaker.colorScheme]} p-5 sm:p-6 flex flex-col justify-center flex-1`}
              >
                <h3 className="font-semibold text-lg sm:text-xl text-[#060606] font-grotesk tracking-tight leading-snug">
                  {speaker.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4A4A] mt-1.5 font-sans leading-[150%] font-normal">
                  {speaker.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurSpeakers;
