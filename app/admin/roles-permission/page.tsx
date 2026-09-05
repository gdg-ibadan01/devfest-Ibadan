import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import RolesPermissionPageClient from './RolesPermissionPageClient';

export default async function RolesPermissionPage() {
  const queryClient = getQueryClient();

  // Prefetch both the roles list (RolesTable) and the permissions catalog
  // (used by the Add/Edit Role modals) so both are ready the moment a user
  // opens this page or a modal on it.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.roles.all(),
      queryFn: async () => {
        const { data, status } = await serverFetch('/roles');
        if (status < 200 || status >= 300) {
          throw new Error('Failed to prefetch roles');
        }
        return data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.roles.permissions(),
      queryFn: async () => {
        const { data, status } = await serverFetch('/roles/permissions');
        if (status < 200 || status >= 300) {
          throw new Error('Failed to prefetch permissions');
        }
        return data;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RolesPermissionPageClient />
    </HydrationBoundary>
  );
}
