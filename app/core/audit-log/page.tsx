import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import AuditLogPageClient from './AuditLogPageClient';

const PAGE = 1;
const LIMIT = 10;

export default async function AuditLogPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.auditLogs.all({
        page: PAGE,
        limit: LIMIT,
        sortOrder: 'desc',
      }),
      queryFn: async () => {
        const { data, status } = await serverFetch('/audit-logs', {
          params: { page: PAGE, limit: LIMIT, sortOrder: 'desc' },
        });
        if (status < 200 || status >= 300) {
          throw new Error('Failed to prefetch audit logs');
        }
        return data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.auditLogs.actions(),
      queryFn: async () => {
        const { data, status } = await serverFetch('/audit-logs/actions');
        if (status < 200 || status >= 300) {
          throw new Error('Failed to prefetch audit log actions');
        }
        return data;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuditLogPageClient />
    </HydrationBoundary>
  );
}
