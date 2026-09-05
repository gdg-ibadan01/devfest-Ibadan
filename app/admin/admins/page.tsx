import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import AdminsPageClient from './AdminsPageClient';

// Keep in sync with `page`/`limit` in ./_components/AdminsTable.tsx — this
// is the exact param shape `useAdmins` is called with on first mount, so the
// prefetched cache entry is picked up instantly instead of refetched.
const PAGE = 1;
const FETCH_LIMIT = 100;

export default async function AdminsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.admins.all({ page: PAGE, limit: FETCH_LIMIT }),
    queryFn: async () => {
      const { data, status } = await serverFetch('/admin', {
        params: { page: PAGE, limit: FETCH_LIMIT },
      });
      if (status < 200 || status >= 300) {
        throw new Error('Failed to prefetch admins');
      }
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminsPageClient />
    </HydrationBoundary>
  );
}
