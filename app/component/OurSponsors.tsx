'use client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import oneapp from '@/public/1appnewlogo.8e95dfd0.png';
import agentPesa from '@/public/agentpesa_logo.png';
import etionary from '@/public/etionary-logo-.png';
import foodbolt from '@/public/foodbolt.jpeg';
import codemagic from '@/public/codemagic.svg';
import google from '@/public/Google_Icons-09-512.webp';
import ton from '@/public/TONSociety.png';
import github from '@/public/White2.png';
import lorry from '@/public/lorry.jpg';
import notzero from '@/public/notzero.jpeg';
import interswitch from '@/public/inter-switch.png';
import { Button } from '../_module/components/ui/button';
import { cn } from '../_module/lib/utils';
import { motion } from 'framer-motion';

interface SponsorImageProps {
  imageSrc: StaticImageData;
  alt: string;
  divClassName: string;
  imgDimension?: string;
}

function SponsorImage({ imageSrc, alt, divClassName }: SponsorImageProps) {
  return (
    <div
      className={`${divClassName} hover:scale-110 transition-transform duration-300`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        className={cn('h-full w-full object-center object-contain')}
      />
    </div>
  );
}

const OurSponsors = () => {
  // Animation config
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="bg-[#fcfcfc]">
      <div className="w-full md:max-w-[1500px] mx-auto py-32 md:py-80 px-24">
        <div className="container flex flex-col gap-24 md:gap-36">
          
          {/* Header animated block */}
          <motion.div 
            className="w-full flex md:flex-row flex-col gap-4 items-center justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={textVariants}>
              <h1 className="font-bold text-2xl md:text-5xl text-black">Our sponsors</h1>
              <p className="font-medium text-base pt-3 md:text-xl text-[#4D4D4D]">
                Meet our present sponsors
              </p>
            </motion.div>
            <motion.div variants={buttonVariants}>
              <Link
                href="https://wa.me/2348136023230?text=I'm%20ready%20to%20power%20the%20future%20of%20tech%20at%20DevFest%20Ibadan%202025.%20I%20would%20like%20to%20inquire%20about%20sponsorship%20opportunities%21%20Let's%20connect%20to%20build%20something%20great."
                target="_blank"
              >
                <Button className="text-sm md:text-xl rounded-[100px] bg-black text-white hover:bg-core-blue border border-black px-20 md:px-[60px] py-4 md:py-6 flex items-center justify-center gap-1.5 transition-colors duration-300">
                  <span>Apply to Sponsor</span> <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Present Sponsors Staggered Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={itemVariants}>
              <SponsorImage
                imageSrc={google}
                alt="Google"
                divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SponsorImage
                imageSrc={codemagic}
                alt="Codemagic"
                divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SponsorImage
                imageSrc={notzero}
                alt="NotZero"
                divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SponsorImage
                imageSrc={agentPesa}
                alt="AgentPesa"
                divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SponsorImage
                imageSrc={foodbolt}
                alt="Foodbolt"
                divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SponsorImage
                imageSrc={etionary}
                alt="Etionary"
                divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
              />
            </motion.div>
          </motion.div>

          {/* Past Sponsors Section */}
          <div className="flex flex-col gap-6 md:gap-12 pt-8">
            <motion.h1 
              className="font-bold text-xl md:text-3xl text-black"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Meet our past sponsors
            </motion.h1>

            {/* Past Sponsors Staggered Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.div variants={itemVariants}>
                <SponsorImage
                  imageSrc={ton}
                  alt="Ton Society"
                  divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <SponsorImage
                  imageSrc={interswitch}
                  alt="Interswitch"
                  divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <SponsorImage
                  imageSrc={github}
                  alt="Github Campus"
                  divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <SponsorImage
                  imageSrc={lorry}
                  alt="Lorry Project"
                  divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <SponsorImage
                  imageSrc={oneapp}
                  alt="OneApp"
                  divClassName="bg-white p-5 md:p-10 border border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px] w-full flex items-center justify-center"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurSponsors;
