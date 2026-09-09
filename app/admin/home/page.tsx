import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import HomePageClient from './HomePageClient';

export default async function AdminHome() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: async () => {
      const { data, status } = await serverFetch('/dashboard/overview');
      if (status < 200 || status >= 300) {
        throw new Error('Failed to prefetch dashboard overview');
      }
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}
