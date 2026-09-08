import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  PaginatedAuditLogResponseDto,
  AuditLogDetailResponseDto,
  AuditLogListParams,
} from '@/app/_module/api/types';

// ---- List audit logs (page/limit pagination — different from the
// cursor-based pagination every other list endpoint uses) --------------

async function getAuditLogs(
  params: AuditLogListParams
): Promise<PaginatedAuditLogResponseDto> {
  const { data } = await apiClient.get<PaginatedAuditLogResponseDto>('/audit-logs', { params });
  return data;
}

export function useAuditLogs(params: AuditLogListParams = {}) {
  return useQuery({
    queryKey: queryKeys.auditLogs.all(params as Record<string, unknown>),
    queryFn: () => getAuditLogs(params),
    placeholderData: (previousData) => previousData,
  });
}

// ---- Audit log detail (includes metadata) -----------------------------

async function getAuditLogDetail(id: string): Promise<AuditLogDetailResponseDto> {
  const { data } = await apiClient.get<AuditLogDetailResponseDto>(`/audit-logs/${id}`);
  return data;
}

export function useAuditLogDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.auditLogs.detail(id ?? ''),
    queryFn: () => getAuditLogDetail(id as string),
    enabled: !!id,
  });
}

// ---- Distinct action names (for the action-filter dropdown) -----------

async function getAuditLogActions(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>('/audit-logs/actions');
  return data;
}

export function useAuditLogActions() {
  return useQuery({
    queryKey: queryKeys.auditLogs.actions(),
    queryFn: getAuditLogActions,
    staleTime: 5 * 60 * 1000,
  });
}
