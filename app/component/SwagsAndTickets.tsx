'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { SwagTicketCard, SwagTicketCardProps } from './SwagTicketCard';

const swagPerks = [
  'Official DevFest T-Shirt & Lanyard',
  'Custom Sticker Pack & Notebook',
  'Access to Sponsor Booth Swags',
  'Conference Tote Bag & Badge and a lots more...',
];

const ticketPerks = [
  'Entry pass to all tracks',
  'Exclusive DevFest Luncheon & Coffee',
  'Access to Workshop & Codelabs',
  'Networking Mixer with Global Speakers',
];

const cardsData: SwagTicketCardProps[] = [
  {
    title: 'Get Swags',
    category: 'STANDARD SWAG',
    description: 'Score the official DevFest Ibadan 2026 premium merch pack.',
    perks: swagPerks,
    buttonText: 'Buy Swags',
    buttonHref: 'https://selar.co/m/gdg-ibadan1',
    isExternal: true,
    colorScheme: 'green',
    delay: 0,
  },
  {
    title: 'Get Tickets',
    category: 'ALL ACCESS PASS',
    description:
      'Reserve your guaranteed spot at the biggest developer experience in Ibadan.',
    perks: ticketPerks,
    buttonText: 'Get Tickets',
    buttonHref: '/tickets',
    colorScheme: 'red',
    delay: 0.15,
  },
];

const SwagsAndTickets: FC = () => {
  return (
    <section className="w-full bg-white py-28 md:py-64 lg:py-96">
      <div className="w-full md:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-black text-3xl sm:text-4xl md:text-5xl text-black tracking-tight font-grotesk"
          >
            Swags &amp; Tickets
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 sm:mt-4 text-sm sm:text-base text-[#4B5563] leading-relaxed font-normal"
          >
            DevFest Ibadan 2026 is important to attend! Register early to claim
            your all-access ticket, and grab our legendary exclusive merch
            hoodies, premium tees, notebooks, and stickers.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 lg:gap-10 max-w-5xl mx-auto mt-32 sm:mt-64">
          {cardsData.map((card) => (
            <SwagTicketCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SwagsAndTickets;
