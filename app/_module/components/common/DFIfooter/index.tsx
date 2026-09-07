'use client';

import { FC, ReactNode } from 'react';
import DFIFooterV1 from './DFIFooterV1';
import DFIFooterV2 from './DFIFooterV2';

export { DFIFooterV1, DFIFooterV2 };

export interface DFIFooterProps {
  variant?: 'default' | 'v1' | 'v2';
}

export const DFIFooter: FC<DFIFooterProps> = ({
  variant = 'default',
}): ReactNode => {
  if (variant === 'v2') {
    return <DFIFooterV2 />;
  }

  return <DFIFooterV1 />;
};

export default DFIFooter;
