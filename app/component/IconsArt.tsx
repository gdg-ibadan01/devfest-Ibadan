'use client';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  BigPlus,
  Colon,
  CurlyBraces,
  Groundnut,
  Hashtag,
  SemiColon,
  SplittedTag,
} from '../_module/components/icons';
import { useEffect, useRef } from 'react';

type IconArt = {
  className?: string;
  showFull?: boolean;
};

const IconsArt = ({ className, showFull = true }: IconArt) => {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });
  const controls = useAnimation();
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const dropInVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };
  return (
    <div className={className} ref={heroRef}>
      {showFull ? (
        <div className="flex justify-between gap-[280px] md:gap-0">
          <BigPlus fill="fill-core-red" stroke="stroke-black" />
          <Hashtag fill="fill-core-green" stroke="stroke-black" />
        </div>
      ) : null}
      {/* <div className="flex justify-between items-end -mt-80 md:-mt-44">
          <CurlyBraces className="fill-pastel-green stroke-black" />
          <Colon fill="fill-core-blue" stroke="stroke-black" />
          <Groundnut fill="fill-pastel-red" stroke="stroke-black" />
          <SemiColon fill="fill-core-yellow" stroke="stroke-black" />
          <SplittedTag fill="fill-halftone-red" stroke="stroke-black" />
        </div> */}

      <motion.div
        className="doodles flex justify-between items-end"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div
          className="doodleContainer w-full lg:w-[240px]"
          variants={dropInVariants}
        >
          <CurlyBraces className="fill-pastel-green stroke-black" />
        </motion.div>
        <motion.div
          className="doodleContainer w-full lg:w-[300px] "
          variants={dropInVariants}
        >
          <Colon fill="fill-core-blue" stroke="stroke-black" />
        </motion.div>
        <motion.div
          className="doodleContainer w-full lg:w-[525px]"
          variants={dropInVariants}
        >
          <Groundnut fill="fill-pastel-red" stroke="stroke-black" />
        </motion.div>
        <motion.div
          className="doodleContainer w-full lg:w-[245px]"
          variants={dropInVariants}
        >
          <SemiColon fill="fill-core-yellow" stroke="stroke-black" />
        </motion.div>
        <motion.div
          className="doodleContainer w-full lg:w-[344px]"
          variants={dropInVariants}
        >
          <SplittedTag fill="fill-halftone-red" stroke="stroke-black" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IconsArt;
