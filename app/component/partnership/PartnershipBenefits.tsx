'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PARTNERSHIP_BENEFITS } from './data';

export const PartnershipBenefits: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto lg:mx-0 flex flex-col"
    >
      <div className="border border-black rounded-3xl p-6 sm:p-8 md:p-[32px] bg-white shadow-sm flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-7">
            <h3 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-black uppercase">
              WHY PARTNER WITH DEVFEST IBADAN
            </h3>
            <Sparkles className="w-4 h-4 text-[#FBBC04]" />
          </div>

          <div className="space-y-6 sm:space-y-7">
            {PARTNERSHIP_BENEFITS.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3.5 sm:gap-4"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: item.dotColor }}
                />
                <div>
                  <h4 className="font-mono font-bold text-sm sm:text-base text-black leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4B5563] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2DFD8] flex items-center justify-between text-xs font-mono text-[#4B5563]">
          <span>CUSTOM SPONSORSHIP TIERS AVAILABLE</span>
          <span className="text-[#34A853] font-bold">2026 EDITION</span>
        </div>
      </div>
    </motion.div>
  );
};
