import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type { DashboardOverviewResponseDto } from '@/app/_module/api/types';

// ---- Dashboard overview (Home page: stats + registration trend +
// ticket breakdown + recent attendees, all in one call) --------------

async function getDashboardOverview(): Promise<DashboardOverviewResponseDto> {
  const { data } = await apiClient.get<DashboardOverviewResponseDto>('/dashboard/overview');
  return data;
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: getDashboardOverview,
  });
}
