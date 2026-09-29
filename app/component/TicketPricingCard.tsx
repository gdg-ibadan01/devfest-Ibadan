'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface TicketPricingCardProps {
  id?: string;
  name: string;
  price: string;
  subtitle: string;
  badge?: string;
  isPopular?: boolean;
  buttonText: string;
  buttonHref: string;
  features: string[];
  delay?: number;
  className?: string;
}

export const TicketPricingCard: FC<TicketPricingCardProps> = ({
  name,
  price,
  subtitle,
  badge,
  isPopular = false,
  buttonText,
  buttonHref,
  features,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={`relative flex flex-col justify-between rounded-[22px] bg-white p-6 sm:p-7 transition-all duration-300 hover:shadow-lg ${
        isPopular
          ? 'border-2 border-[#3B82F6] shadow-sm'
          : 'border border-gray-200/90 shadow-sm'
      } ${className}`}
    >
      <div>
        {/* Tier Category Header */}
        <span
          className={`block text-[11px] font-bold tracking-wider uppercase mb-2 ${
            isPopular ? 'text-[#2563EB]' : 'text-neutral-900'
          }`}
        >
          {name}
        </span>

        {/* Price & Best Value Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-3xl sm:text-[34px] font-black text-[#111827] tracking-tight font-grotesk leading-none">
            {price}
          </span>
          {badge && (
            <span className="bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-1 rounded-[100px] tracking-wide uppercase">
              {badge}
            </span>
          )}
        </div>

        {/* Subtitle */}
        <p className="mt-2 text-xs sm:text-[13px] text-[#6B7280] font-normal leading-normal">
          {subtitle}
        </p>

        {/* CTA Button */}
        <div className="mt-6">
          {isPopular ? (
            <Link
              href={buttonHref}
              className="flex items-center justify-center w-full py-3 px-4 rounded-[100px] bg-[#111111] hover:bg-black text-white text-sm font-medium transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              {buttonText}
            </Link>
          ) : (
            <Link
              href={buttonHref}
              className="group relative flex w-full p-[2px] rounded-[100px] overflow-hidden transition-all duration-200 hover:opacity-95 active:scale-[0.98]"
            >
              {/* <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" /> */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
              <span className="relative flex items-center justify-center w-full py-2.5 px-4 rounded-[100px] bg-white group-hover:bg-neutral-50/90 text-sm font-semibold text-[#111827] transition-colors">
                {buttonText}
              </span>
            </Link>
          )}
        </div>

        {/* Divider Line */}
        <div className="w-full border-t border-gray-100 my-6" />

        {/* Features List */}
        <ul className="space-y-3.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5 stroke-[2.5]" />
              <span className="text-xs sm:text-[13px] text-[#374151] leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TicketPricingCard;
