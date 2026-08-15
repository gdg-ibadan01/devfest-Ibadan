'use client';

import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import AuditLogTable from './_components/AuditLogTable';

export default function AuditLogPage() {
  return (
    <AdminWrapper title="Audit Log">
      <div className="px-[32px] py-[24px]">
        <AuditLogTable />
      </div>
    </AdminWrapper>
  );
}