'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import DiscountTable from './_components/DiscountTable';
import CreateDiscountModal from './_components/CreateDiscountModal';
import DeleteDiscountModal from './_components/DeleteDiscountModal';
import type {
  DiscountRecord,
  CreateDiscountForm,
} from './_types/discount.types';

export default function DiscountReferralPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DiscountRecord | null>(
    null
  );

  const handleCreate = (data: CreateDiscountForm) => {
    console.log('Create discount', data);
  };

  const handleEdit = (record: DiscountRecord) => {
    setSelectedRecord(record);
    setCreateOpen(true);
  };

  const handleDeleteClick = (record: DiscountRecord) => {
    setSelectedRecord(record);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Delete discount', selectedRecord?.id);
    setDeleteOpen(false);
    setSelectedRecord(null);
  };

  return (
    <AdminWrapper title="Discount">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        <DiscountTable
          onCreateClick={() => setCreateOpen(true)}
          onEditClick={handleEdit}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      <CreateDiscountModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setSelectedRecord(null);
        }}
        onSubmit={handleCreate}
      />

      <DeleteDiscountModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedRecord(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </AdminWrapper>
  );
}
