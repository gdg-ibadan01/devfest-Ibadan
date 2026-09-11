'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { PARTNERSHIP_STATS } from './data';

export const PartnershipStats: FC = () => {
  return (
    <div className="border-y border-[#E2DFD8]">
      <div className="w-full md:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-24 py-32 lg:py-64">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PARTNERSHIP_STATS.map((item, index) => (
            <motion.div
              key={item.label}
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
                  {item.value}
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
  );
};
