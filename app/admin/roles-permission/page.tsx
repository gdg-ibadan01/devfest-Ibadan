'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import RolesTable from './_components/RolesTable';
import RoleFormModal from './_components/RoleFormModal';
import RoleDetailModal from './_components/RoleDetailModal';
import DeactivateRoleModal from './_components/DeactivateRoleModal';
import RoleSuccessModal from './_components/RoleSuccessModal';
import InvitePeopleModal from './_components/InvitePeopleModal';
import type { RoleFormData, InviteFormData } from './_types/role.types';
import type { ListRolesItemResponseDto } from '@/app/_module/api/types';

type ModalState = 'none' | 'add' | 'invite' | 'detail' | 'edit' | 'deactivate' | 'success';

export default function RolesPermissionPage() {
  const [modal, setModal] = useState<ModalState>('none');
  const [selectedRole, setSelectedRole] = useState<ListRolesItemResponseDto | null>(null);
  const [deactivateSource, setDeactivateSource] = useState<'detail' | 'table'>('table');
  const [successAction, setSuccessAction] = useState<'create' | 'edit' | undefined>(undefined);

  const openDetail = (role: ListRolesItemResponseDto) => {
    setSelectedRole(role);
    setModal('detail');
  };

  const openEdit = (role: ListRolesItemResponseDto) => {
    setSelectedRole(role);
    setModal('edit');
  };

  // Called from table action menu — after close, go back to detail
  const openDeactivateFromTable = (role: ListRolesItemResponseDto) => {
    setSelectedRole(role);
    setDeactivateSource('table');
    setModal('deactivate');
  };

  // Called from detail modal — after close, go back to detail
  const openDeactivateFromDetail = () => {
    setDeactivateSource('detail');
    setModal('deactivate');
  };

  const handleFormSubmit = (action?: 'create' | 'edit') => {
    setSuccessAction(action);
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
        action={successAction}
        onDashboard={closeAll}
      />
    </AdminWrapper>
  );
}
