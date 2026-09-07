'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const submissionSteps = [
  {
    title: 'Applications Open',
    description: 'Submit your topic and abstract',
    dotColor: '#34A853', // Green
  },
  {
    title: 'Review Period',
    description: 'Our team reviews all submissions',
    dotColor: '#FBBC04', // Yellow
  },
  {
    title: 'Speakers Announced',
    description: 'Selected speakers notified via email',
    dotColor: '#EA4335', // Red
  },
  {
    title: 'Event Day — 26 Nov 2026',
    description: 'Take the stage at DevFest Ibadan',
    dotColor: '#4285F4', // Blue
  },
];

const statsData = [
  {
    stat: '1 DAY',
    color: '#34A853', // Green
    label: '26 NOVEMBER 2026',
    description:
      'One power-packed day of expert talks, code labs, and pure technical vibes.',
  },
  {
    stat: '4+ TRACKS',
    color: '#EA4335', // Red
    label: 'WEB · MOBILE · AI · CLOUD',
    description:
      'Deep-dive tracks tailored specifically to the domains defining modern global tech.',
  },
  {
    stat: '20+ SPEAKERS',
    color: '#FBBC04', // Yellow
    label: 'INDUSTRY LEADERS',
    description:
      'Learn design, scale, and performance patterns from engineering giants.',
  },
  {
    stat: '10+ YEARS',
    color: '#4285F4', // Blue
    label: 'COMMUNITY LEGACY',
    description:
      'Celebrating 10+ years of empowering and connecting South-West devs.',
  },
];

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
                SUBMISSION DETAILS
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
            <h2 className="font-semibold text-4xl lg:text-[40px] xl:text-[48px] tracking-[0%] leading-[105%] text-[#111111] font-grotesk">
              Got Something Worth Sharing? Take the Stage.
            </h2>

            <p className="mt-[10px] sm:mt-[20px] text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl">
              We&apos;re looking for passionate developers, designers, and tech
              leaders to share insights, lead sessions, and spark meaningful
              conversations.
            </p>

            <div className="mt-[10px]] sm:mt-[32px]">
              <Link
                href="https://sessionize.com/devfest-ibadan-2025/"
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
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="border border-black rounded-2xl p-6 sm:p-7 bg-white flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <h3
                    className="text-4xl sm:text-[38px] font-black tracking-tight leading-none font-grotesk"
                    style={{ color: item.color }}
                  >
                    {item.stat}
                  </h3>

                  <h4 className="font-mono font-bold text-xs sm:text-[11px] tracking-wider text-black uppercase mt-6 mb-2">
                    {item.label}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallForSpeakers;
