'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import RolesTable from './_components/RolesTable';
import RoleFormModal from './_components/RoleFormModal';
import RoleDetailModal from './_components/RoleDetailModal';
import DeactivateRoleModal from './_components/DeactivateRoleModal';
import RoleSuccessModal from './_components/RoleSuccessModal';
import type { RoleRecord, RoleFormData } from './_types/role.types';

type ModalState = 'none' | 'add' | 'detail' | 'edit' | 'deactivate' | 'success';

export default function RolesPermissionPage() {
  const [modal, setModal] = useState<ModalState>('none');
  const [selectedRole, setSelectedRole] = useState<RoleRecord | null>(null);

  const openDetail = (role: RoleRecord) => {
    setSelectedRole(role);
    setModal('detail');
  };

  const openEdit = (role: RoleRecord) => {
    setSelectedRole(role);
    setModal('edit');
  };

  const openDeactivate = (role: RoleRecord) => {
    setSelectedRole(role);
    setModal('deactivate');
  };

  const handleFormSubmit = (_data: RoleFormData) => {
    // TODO: integrate API
    setModal('success');
  };

  const handleDeactivateConfirm = () => {
    // TODO: integrate API
    setModal('none');
    setSelectedRole(null);
  };

  const closeAll = () => {
    setModal('none');
    setSelectedRole(null);
  };

  const editFromDetail = () => setModal('edit');
  const deactivateFromDetail = () => setModal('deactivate');

  return (
    <AdminWrapper title="Roles & Permission">
      <div className="px-[32px] py-[24px]">
        <RolesTable
          onAddRole={() => setModal('add')}
          onRowClick={openDetail}
          onEdit={openEdit}
          onDeactivate={openDeactivate}
        />
      </div>

      {/* Add New Role */}
      <RoleFormModal
        open={modal === 'add'}
        mode="add"
        onClose={closeAll}
        onSubmit={handleFormSubmit}
      />

      {/* Edit Role */}
      <RoleFormModal
        open={modal === 'edit'}
        mode="edit"
        initialData={
          selectedRole
            ? {
                name: selectedRole.name,
                description: selectedRole.description,
                permissions: selectedRole.permissions,
              }
            : undefined
        }
        onClose={closeAll}
        onSubmit={handleFormSubmit}
      />

      {/* Role Detail */}
      <RoleDetailModal
        open={modal === 'detail'}
        role={selectedRole}
        onClose={closeAll}
        onEdit={editFromDetail}
        onDeactivate={deactivateFromDetail}
      />

      {/* Deactivate Confirm */}
      <DeactivateRoleModal
        open={modal === 'deactivate'}
        onClose={() => setModal(selectedRole ? 'detail' : 'none')}
        onConfirm={handleDeactivateConfirm}
      />

      {/* Success */}
      <RoleSuccessModal
        open={modal === 'success'}
        onDashboard={closeAll}
      />
    </AdminWrapper>
  );
}
