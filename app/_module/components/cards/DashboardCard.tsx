import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const DashboardCard = ({ children, className }: CardProps) => {
  return (
    <section
      className={cn(
        'rounded-[14px] bg-white shadow-[0_4px_18px_#00000004]',
        className
      )}
    >
      {children}
    </section>
  );
};

export default DashboardCard;
