'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import AdminsTable from './_components/AdminsTable';
import AdminDetailModal from './_components/AdminDetailModal';
import DeactivateAdminModal from './_components/DeactivateAdminModal';
import type { FindAllAdminsItemDto } from '@/app/_module/api/types';

type ModalState = 'none' | 'detail' | 'deactivate';

export default function AdminsPage() {
  const [modal, setModal] = useState<ModalState>('none');
  const [selectedAdmin, setSelectedAdmin] = useState<FindAllAdminsItemDto | null>(null);
  const [deactivateSource, setDeactivateSource] = useState<'detail' | 'table'>('table');

  const openDetail = (admin: FindAllAdminsItemDto) => {
    setSelectedAdmin(admin);
    setModal('detail');
  };

  // Called from table action menu
  const openDeactivateFromTable = (admin: FindAllAdminsItemDto) => {
    setSelectedAdmin(admin);
    setDeactivateSource('table');
    setModal('deactivate');
  };

  // Called from detail modal
  const openDeactivateFromDetail = () => {
    setDeactivateSource('detail');
    setModal('deactivate');
  };

  const handleDeactivateConfirm = () => {
    setModal('none');
    setSelectedAdmin(null);
  };

  const handleDeactivateClose = () => {
    if (deactivateSource === 'detail') {
      setModal('detail');
    } else {
      setModal('none');
      setSelectedAdmin(null);
    }
  };

  const closeAll = () => {
    setModal('none');
    setSelectedAdmin(null);
  };

  return (
    <AdminWrapper title="Admins">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        <AdminsTable onRowClick={openDetail} onDeactivate={openDeactivateFromTable} />
      </div>

      {/* Admin Detail */}
      <AdminDetailModal
        open={modal === 'detail'}
        admin={selectedAdmin}
        onClose={closeAll}
        onDeactivate={openDeactivateFromDetail}
      />

      {/* Deactivate Confirm */}
      <DeactivateAdminModal
        open={modal === 'deactivate'}
        adminId={selectedAdmin?.id}
        adminName={selectedAdmin?.fullName}
        onClose={handleDeactivateClose}
        onConfirm={handleDeactivateConfirm}
      />
    </AdminWrapper>
  );
}
