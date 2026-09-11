'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

export const PartnershipHeader: FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-64 sm:mb-80">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border border-black text-xs font-mono font-bold tracking-widest text-black uppercase bg-[#FEF7E0] mb-6 shadow-xs"
      >
        <Handshake className="w-4 h-4 text-[#EA4335]" />
        <span>CALL FOR PARTNERSHIP</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="font-semibold text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] tracking-[0%] leading-[135%] sm:leading-[130%] text-[#111111] font-grotesk"
      >
        Partner with us to shape the future of tech
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-4 sm:mt-6 text-base sm:text-lg text-[#4B5563] leading-[170%] max-w-2xl mx-auto"
      >
        DevFest Ibadan is one of the largest tech gatherings in Southwest
        Nigeria. Collaborate with us to spotlight your brand, engage top tech
        talent, and drive sustainable innovation.
      </motion.p>
    </div>
  );
};
