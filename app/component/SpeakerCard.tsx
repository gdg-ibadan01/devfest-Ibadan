'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { FC } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SpeakerItem } from '../_module/data';

export interface SpeakerCardProps {
  speaker: SpeakerItem;
  index?: number;
  className?: string;
}

const colorStyles: Record<SpeakerItem['colorScheme'], string> = {
  blue: 'bg-[#C3ECF6]',
  yellow: 'bg-[#FFE7A5]',
  green: 'bg-[#CCF6C5]',
  pink: 'bg-[#F8D8D8]',
};

export const SpeakerCard: FC<SpeakerCardProps> = ({
  speaker,
  index = 0,
  className = '',
}) => {
  const reduceMotion = useReducedMotion();
  const socialProfiles = [
    { label: 'X', value: speaker.x },
    { label: 'LinkedIn', value: speaker.linkedin },
    { label: 'Instagram', value: speaker.instagram },
  ].filter((profile) => profile.value?.trim());
  const hasDetails = Boolean(
    speaker.sessionType || speaker.topic || socialProfiles.length
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : index * 0.08,
      }}
      className={`h-full w-full border border-black rounded-[22px] overflow-hidden bg-white flex flex-col shadow-xs hover:shadow-md transition-shadow duration-300 ${className}`.trim()}
    >
      {/* Speaker Photo */}
      <div className="relative w-full aspect-square bg-[#222224] border-b border-black overflow-hidden">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain"
        />
      </div>

      {/* Speaker Details */}
      <div
        className={`${colorStyles[speaker.colorScheme]} p-5 sm:p-6 flex flex-col flex-1`}
      >
        <h3 className="font-semibold text-lg sm:text-xl text-[#060606] font-grotesk tracking-tight leading-snug">
          {speaker.name}
        </h3>
        <p className="text-xs sm:text-sm text-[#4A4A4A] mt-1.5 font-sans leading-[150%] font-normal">
          {speaker.role}
        </p>
        {hasDetails && (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={`View details for ${speaker.name}`}
                className="mt-auto pt-4 min-h-[44px] self-start rounded-sm text-sm font-semibold text-[#060606] underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                View details
              </button>
            </DialogTrigger>
            <DialogContent
              data-lenis-prevent
              className={`bg-white w-[calc(100%-2rem)] max-h-[85dvh] overflow-y-auto rounded-[22px] border-black p-6 motion-reduce:animate-none [&>button]:min-h-[44px] [&>button]:min-w-[44px] [&>button]:focus-visible:outline [&>button]:focus-visible:outline-2 [&>button]:focus-visible:outline-black`}
            >
              <div className="pr-[44px]">
                <DialogTitle className="font-grotesk text-2xl leading-snug text-[#060606]">
                  {speaker.name}
                </DialogTitle>
                <DialogDescription className="mt-2 text-[#4A4A4A]">
                  {speaker.role}
                </DialogDescription>
              </div>
              <div className="space-y-4 border-t border-black/15 pt-4 mt-2 text-sm text-[#060606]">
                {speaker.sessionType && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]">
                      Session type
                    </p>
                    <p className="mt-1">{speaker.sessionType}</p>
                  </div>
                )}
                {speaker.topic && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]">
                      Topic
                    </p>
                    <p className="mt-1 font-medium leading-relaxed break-words">
                      {speaker.topic}
                    </p>
                  </div>
                )}
                {socialProfiles.length > 0 && (
                  <ul
                    className="flex flex-wrap gap-x-4 gap-y-1"
                    aria-label={`${speaker.name}'s social profiles`}
                  >
                    {socialProfiles.map(({ label, value }) => (
                      <li key={label} className="min-w-0 break-words">
                        {/^https?:\/\//i.test(value!.trim()) ? (
                          <a
                            href={value!.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${speaker.name} on ${label} (opens in a new tab)`}
                            className="inline-flex min-h-11 items-center rounded-sm font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                          >
                            {label}
                          </a>
                        ) : (
                          <span className="inline-block py-3">
                            <span className="font-semibold">{label}:</span>{' '}
                            {value}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </motion.div>
  );
};
