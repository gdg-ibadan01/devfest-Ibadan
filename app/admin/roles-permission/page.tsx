'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import RolesTable from './_components/RolesTable';
import RoleFormModal from './_components/RoleFormModal';
import RoleDetailModal from './_components/RoleDetailModal';
import DeactivateRoleModal from './_components/DeactivateRoleModal';
import RoleSuccessModal from './_components/RoleSuccessModal';
import InvitePeopleModal from './_components/InvitePeopleModal';
import type { RoleRecord, RoleFormData, InviteFormData } from './_types/role.types';

type ModalState = 'none' | 'add' | 'invite' | 'detail' | 'edit' | 'deactivate' | 'success';

export default function RolesPermissionPage() {
  const [modal, setModal] = useState<ModalState>('none');
  const [selectedRole, setSelectedRole] = useState<RoleRecord | null>(null);
  const [deactivateSource, setDeactivateSource] = useState<'detail' | 'table'>('table');

  const openDetail = (role: RoleRecord) => {
    setSelectedRole(role);
    setModal('detail');
  };

  const openEdit = (role: RoleRecord) => {
    setSelectedRole(role);
    setModal('edit');
  };

  // Called from table action menu — after close, go back to detail
  const openDeactivateFromTable = (role: RoleRecord) => {
    setSelectedRole(role);
    setDeactivateSource('table');
    setModal('deactivate');
  };

  // Called from detail modal — after close, go back to detail
  const openDeactivateFromDetail = () => {
    setDeactivateSource('detail');
    setModal('deactivate');
  };

  const handleFormSubmit = (_data?: RoleFormData | InviteFormData) => {
    setModal('success');
  };

  const handleDeactivateConfirm = () => {
    setModal('none');
    setSelectedRole(null);
  };

  const handleDeactivateClose = () => {
    if (deactivateSource === 'detail') {
      setModal('detail');
    } else {
      setModal('none');
      setSelectedRole(null);
    }
  };

  const closeAll = () => {
    setModal('none');
    setSelectedRole(null);
  };

  return (
    <AdminWrapper title="Roles & Permission">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        <RolesTable
          onAddRole={() => setModal('add')}
          onInvite={() => setModal('invite')}
          onRowClick={openDetail}
          onEdit={openEdit}
          onDeactivate={openDeactivateFromTable}
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
        roleId={selectedRole?.id}
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

      {/* Invite People */}
      <InvitePeopleModal
        open={modal === 'invite'}
        onClose={closeAll}
        onSubmit={handleFormSubmit}
      />

      {/* Role Detail */}
      <RoleDetailModal
        open={modal === 'detail'}
        role={selectedRole}
        onClose={closeAll}
        onEdit={() => openEdit(selectedRole!)}
        onDeactivate={openDeactivateFromDetail}
      />

      {/* Deactivate Confirm */}
      <DeactivateRoleModal
        open={modal === 'deactivate'}
        roleId={selectedRole?.id}
        onClose={handleDeactivateClose}
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
