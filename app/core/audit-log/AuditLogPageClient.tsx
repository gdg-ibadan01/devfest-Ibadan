'use client';

import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import AuditLogTable from './_components/AuditLogTable';

export default function AuditLogPageClient() {
  return (
    <AdminWrapper title="Audit Log">
      <div className="px-[20px] py-[24px] lg:px-[32px]">
        <AuditLogTable />
      </div>
    </AdminWrapper>
  );
}
