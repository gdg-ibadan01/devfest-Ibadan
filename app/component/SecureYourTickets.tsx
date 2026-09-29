'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { TicketPricingCard } from './TicketPricingCard';
import { ticketTiers } from '@/app/_module/data/secure-your-tickets.data';

const SecureYourTickets: FC = () => {
  return (
    <section
      id="tickets"
      className="w-full bg-white py-20 sm:py-[96px] scroll-mt-8 sm:scroll-mt-12"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight font-grotesk"
          >
            Secure your tickets
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-3.5 text-sm sm:text-base text-[#4A4A4A] leading-relaxed font-sans"
          >
            Lock in your spot at DevFest Ibadan 2026. Early bird pricing
            won&apos;t last forever.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {ticketTiers.map((tier, index) => (
            <TicketPricingCard key={tier.id} {...tier} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecureYourTickets;
