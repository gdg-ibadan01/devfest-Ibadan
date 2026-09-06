import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  AuditLogListParams,
  AuditLogListResponseDto,
  AuditLogItemDto,
} from '@/app/_module/api/types';

// ---- List audit logs ----------------------------------------

async function getAuditLogs(params: AuditLogListParams): Promise<AuditLogListResponseDto> {
  const { data } = await apiClient.get<AuditLogListResponseDto>('/audit-logs', { params });
  return data;
}

export function useAuditLogs(params: AuditLogListParams = {}) {
  return useQuery({
    queryKey: queryKeys.auditLogs.all(params as Record<string, unknown>),
    queryFn: () => getAuditLogs(params),
  });
}

// ---- Get audit log by ID -----------------------------------

async function getAuditLog(id: string): Promise<{ success: boolean; data: AuditLogItemDto }> {
  const { data } = await apiClient.get<{ success: boolean; data: AuditLogItemDto }>(`/audit-logs/${id}`);
  return data;
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: queryKeys.auditLogs.detail(id),
    queryFn: () => getAuditLog(id),
    enabled: !!id,
  });
}
