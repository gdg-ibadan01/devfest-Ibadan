'use client';

import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import CheckinsTable from './_components/CheckinsTable';

export default function CheckinsPageClient() {
  return (
    <AdminWrapper title="Checkins">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        <CheckinsTable />
      </div>
    </AdminWrapper>
  );
}
