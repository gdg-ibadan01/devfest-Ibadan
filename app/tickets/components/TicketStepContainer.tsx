'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TicketStepContainerProps {
  stepKey: string;
  className?: string;
  children: React.ReactNode;
}

export default function TicketStepContainer({
  stepKey,
  className = 'w-full flex justify-center z-10',
  children,
}: Readonly<TicketStepContainerProps>) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
