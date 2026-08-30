import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  ListRolesResponseDto,
  GetRoleResponseDto,
  CreateRoleDto,
  CreateRoleResponseDto,
  UpdateRoleDto,
  ListPermissionsResponse,
  AdminActionResponseDto,
} from '@/app/_module/api/types';

// ---- List roles ---------------------------------------------

async function getRoles(): Promise<ListRolesResponseDto> {
  const { data } = await apiClient.get<ListRolesResponseDto>('/roles');
  return data;
}

export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles.all(),
    queryFn: getRoles,
  });
}

// ---- Get role -----------------------------------------------

async function getRole(id: string): Promise<GetRoleResponseDto> {
  const { data } = await apiClient.get<GetRoleResponseDto>(`/roles/${id}`);
  return data;
}

export function useRole(id: string) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => getRole(id),
    enabled: !!id,
  });
}

// ---- Permissions list ---------------------------------------

async function getPermissions(): Promise<ListPermissionsResponse> {
  const { data } = await apiClient.get<ListPermissionsResponse>('/roles/permissions');
  return data;
}

export function usePermissions() {
  return useQuery({
    queryKey: queryKeys.roles.permissions(),
    queryFn: getPermissions,
  });
}

// ---- Create role --------------------------------------------

async function createRole(dto: CreateRoleDto): Promise<CreateRoleResponseDto> {
  const { data } = await apiClient.post<CreateRoleResponseDto>('/roles', dto);
  return data;
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      showToast.success('Role created successfully');
      queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
    },
    onError: (error: Error) => {
      showToast.error(error.message || 'Failed to create role');
    },
  });
}

// ---- Update role --------------------------------------------

async function updateRole({ id, dto }: { id: string; dto: UpdateRoleDto }): Promise<void> {
  await apiClient.patch(`/roles/${id}`, dto);
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,
    onSuccess: (_data, { id }) => {
      showToast.success('Role updated successfully');
      queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(id) });
    },
    onError: (error: Error) => {
      showToast.error(error.message || 'Failed to update role');
    },
  });
}

// ---- Deactivate role ----------------------------------------

async function deactivateRole(id: string): Promise<AdminActionResponseDto> {
  const { data } = await apiClient.patch<AdminActionResponseDto>(`/roles/${id}/deactivate`);
  return data;
}

export function useDeactivateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateRole,
    onSuccess: () => {
      showToast.success('Role deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
    },
    onError: (error: Error) => {
      showToast.error(error.message || 'Failed to deactivate role');
    },
  });
}
