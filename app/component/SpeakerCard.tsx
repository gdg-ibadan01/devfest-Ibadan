'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { FC, useId, useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();
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
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={(event) => {
        if (
          !(event.currentTarget instanceof HTMLElement) ||
          !event.currentTarget.contains(document.activeElement)
        ) {
          setIsExpanded(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsExpanded(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          // Return focus before hiding a focused social link.
          event.currentTarget.querySelector('button')?.focus();
          setIsExpanded(false);
        }
      }}
      className={`group self-start w-full border border-black rounded-[22px] overflow-hidden bg-white flex flex-col shadow-xs hover:shadow-md transition-shadow duration-300 ${className}`.trim()}
    >
      {/* Speaker Photo */}
      <div className="relative w-full aspect-[4/3] bg-[#222224] border-b border-black overflow-hidden">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
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
        {hasDetails && (
          <>
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} details for ${speaker.name}`}
              onClick={() => setIsExpanded((expanded) => !expanded)}
              className="mt-3 flex min-h-11 w-full items-center justify-between gap-3 rounded-md text-left text-sm font-semibold text-[#060606] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              {isExpanded ? 'Hide details' : 'Show details'}
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                ↓
              </motion.span>
            </button>
            <motion.div
              id={detailsId}
              aria-hidden={!isExpanded}
              initial={false}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.3,
                ease: 'easeInOut',
              }}
              className="overflow-hidden"
            >
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
                            tabIndex={isExpanded ? 0 : -1}
                            aria-label={`${speaker.name} on ${label} (opens in a new tab)`}
                            className="inline-flex min-h-11 items-center rounded-sm font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                          >
                            {label}{' '}
                            <span aria-hidden="true" className="ml-1">
                              ↗
                            </span>
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
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};
