import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { showToast } from '@/app/_module/lib/notify';
import type {
  FindOneAdminResponseDto,
  FindAllAdminsResponseDto,
  InviteAdminDto,
  AdminActionResponseDto,
  AdminListParams,
  PermissionId,
} from '@/app/_module/api/types';
import { notifyApiError } from '../lib/apiError';
import { hasAnyPermission } from '../lib/permissions';

//Get current admin (me) 

async function getMe(): Promise<FindOneAdminResponseDto> {
  const { data } = await apiClient.get<FindOneAdminResponseDto>('/admin/me');
  return data;
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * The signed-in admin's permission IDs (from /admin/me) plus a `can()` helper
 * — true when the role has ANY of the given permissions.
 */
export function useMyPermissions() {
  const { data: me, isLoading } = useMe();
  const permissions = (me?.role?.permissions ?? []) as PermissionId[];
  return {
    permissions,
    isLoading,
    can: (...required: PermissionId[]) =>
      hasAnyPermission(permissions, required),
  };
}

//List all admins 

async function getAdmins(params: AdminListParams): Promise<FindAllAdminsResponseDto> {
  const { data } = await apiClient.get<FindAllAdminsResponseDto>('/admin', { params });
  return data;
}

export function useAdmins(params: AdminListParams = {}) {
  return useQuery({
    queryKey: queryKeys.admins.all(params as Record<string, unknown>),
    queryFn: () => getAdmins(params),
  });
}

//Invite admin 

async function inviteAdmin(dto: InviteAdminDto): Promise<AdminActionResponseDto> {
  const { data } = await apiClient.post<AdminActionResponseDto>('/admin/invite', dto);
  return data;
}

export function useInviteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteAdmin,
    onSuccess: (data) => {
      showToast.success(data.message || 'Invitation sent');
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all(), exact: false });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to send invitation');
    },
  });
}

//Deactivate admin 

async function deactivateAdmin(id: string): Promise<AdminActionResponseDto> {
  const { data } = await apiClient.patch<AdminActionResponseDto>(`/admin/deactivate/${id}`);
  return data;
}

export function useDeactivateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateAdmin,
    onSuccess: (data) => {
      showToast.success(data.message || 'Admin deactivated');
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all(), exact: false });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to deactivate admin');
    },
  });
}
