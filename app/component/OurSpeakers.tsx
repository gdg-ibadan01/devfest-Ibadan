'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import IconsArt from './IconsArt';
import { motion } from 'framer-motion';

const OurSpeakers = () => {
  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 },
    },
  };

  return (
    <section className="bg-[#fcfcfc] w-full">
      <div className="w-full md:max-w-[1500px] mx-auto py-32 md:py-80">
        <motion.div
          className="container flex flex-col gap-5 md:gap-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Header section animated reveal */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-6xl font-bold"
          >
            Meet our amazing speakers
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex flex-row gap-2 md:gap-5"
          >
            <Link
              href="/speakers"
              className="bg-black py-4 md:py-[33px] px-52 md:px-[106px] text-white hover:bg-core-blue hover:text-white rounded-[100px] flex items-center justify-center transition-colors duration-300"
            >
              View All <ArrowUpRight className="ml-1 w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="bg-white py-4 md:py-[33px] px-52 md:px-[106px] border-[1px] border-black hover:border-core-blue text-black hover:bg-core-blue hover:text-white rounded-[100px] transition-colors duration-300"
            >
              Apply to Speak
            </Link>
          </motion.div>

          {/* <section className="grid grid-cols-1 md:grid-cols-4 gap-24">
              {Speakers.map((data, idx) => (
                <Fragment key={idx}>
                  <SpeakerCard {...data} />
                </Fragment>
              ))}
            </section> */}

          {/* Speakers Coming Soon animated reveal */}
          <motion.section
            variants={containerVariants}
            className="flex gap-5 flex-col items-center py-24"
          >
            <motion.p
              variants={itemVariants}
              className="font-medium text-[48px] md:text-[52px] leading-[120%] text-center"
            >
              Speakers Coming Soon
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-xl font-extralight text-[#4D4D4D] md:w-[820px] text-center leading-relaxed"
            >
              Our speaker lineup is almost here! Prepare to be inspired by
              industry leaders, tech innovators, and creative thinkers who will
              transform your DevFest experience.
            </motion.p>
          </motion.section>
        </motion.div>
      </div>
      <IconsArt className="flex flex-col -mt-64 md:-mt-[250px]" />
    </section>
  );
};

export default OurSpeakers;
