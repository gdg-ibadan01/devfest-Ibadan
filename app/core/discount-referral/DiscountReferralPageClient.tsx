'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import DiscountTable from './_components/DiscountTable';
import CreateDiscountModal from './_components/CreateDiscountModal';

export default function DiscountReferralPageClient() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <AdminWrapper title="Discount">
      <div className="px-[20px] py-[24px] lg:px-[32px]">
        <DiscountTable onCreateClick={() => setCreateOpen(true)} />
      </div>
      <CreateDiscountModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </AdminWrapper>
  );
}
