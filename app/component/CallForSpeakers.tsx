'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { StatCard } from './StatCard';
import {
  submissionSteps,
  statsData,
} from '@/app/_module/data/call-for-speakers.data';

const CallForSpeakers: FC = () => {
  return (
    <section className="w-full bg-white ">
      <div className="w-full md:max-w-[1138px] mx-auto px-4 sm:px-6 lg:px-24 py-24 md:py-48 lg:py-96">
        {/* Top Section: Submission Details & Call to Action */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] lg:gap-[63px] items-center">
          {/* Left Column: Submission Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl mx-auto lg:mx-0"
          >
            <div className="border border-black rounded-3xl p-6 sm:p-8 md:p-[32px] bg-white shadow-sm">
              <h3 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-black uppercase mb-7">
                SUBMISSION PROCESS
              </h3>

              <div className="space-y-6 sm:space-y-7">
                {submissionSteps.map((step) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-3.5 sm:gap-4"
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: step.dotColor }}
                    />
                    <div>
                      <h4 className="font-mono font-bold text-sm sm:text-base text-black leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Heading, Subtitle & Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-start"
          >
            <h2 className="font-semibold text-4xl lg:text-[40px] xl:text-[48px] tracking-[0%] leading-[130%] sm:leading-[120%] text-[#111111] font-grotesk">
              Got something worth sharing? Take the stage.
            </h2>

            <p className="mt-[10px] sm:mt-[20px] text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl">
              We&apos;re looking for passionate developers, designers, and tech
              leaders to share insights, lead sessions, and spark meaningful
              conversations.
            </p>

            <div className="mt-[10px]] sm:mt-[32px]">
              <Link
                href="https://tinyurl.com/devfestib2026"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                {/* Google Multi-Color Gradient Ring */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
                {/* Inner Button */}
                <span className="relative px-20 lg:px-10 py-3 sm:py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center">
                  Apply to speak
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-y border-[#E2DFD8]">
        {/* Bottom Section: 4 Stat Cards */}
        <div className="w-full md:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-24 py-32 lg:py-64">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {statsData.map((item, index) => (
              <StatCard
                key={item.stat}
                stat={item.stat}
                color={item.color}
                label={item.label}
                description={item.description}
                delay={index * 0.08}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallForSpeakers;
