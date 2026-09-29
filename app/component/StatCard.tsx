'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  stat: string;
  color: string;
  label: string;
  description: string;
  delay?: number;
  className?: string;
}

export const StatCard: FC<StatCardProps> = ({
  stat,
  color,
  label,
  description,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={`border border-black rounded-2xl p-6 sm:p-7 bg-white flex flex-col justify-between hover:shadow-md transition-shadow ${className}`}
    >
      <div>
        <h3
          className="text-4xl sm:text-[38px] font-black tracking-tight leading-none font-grotesk"
          style={{ color }}
        >
          {stat}
        </h3>

        <h4 className="font-mono font-bold text-xs sm:text-[11px] tracking-wider text-black uppercase mt-6 mb-2">
          {label}
        </h4>

        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-sans">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
