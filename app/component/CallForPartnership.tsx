'use client';

import { FC } from 'react';
import {
  PartnershipHeader,
  PartnershipBenefits,
  PartnershipContactSection,
} from './partnership';

const CallForPartnership: FC = () => {
  return (
    <section
      id="partnership"
      className="w-full bg-white border-t border-[#E2DFD8]"
    >
      <div className="w-full md:max-w-[1138px] mx-auto px-4 sm:px-6 lg:px-24 py-24 md:py-48 lg:py-96">
        {/* Section Header */}
        <PartnershipHeader />

        {/* Two Columns: Why Partner (Left) & Contact Leads (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] lg:gap-[48px] items-stretch">
          <PartnershipBenefits />
          <PartnershipContactSection />
        </div>
      </div>
    </section>
  );
};

export default CallForPartnership;
export * from './partnership';
