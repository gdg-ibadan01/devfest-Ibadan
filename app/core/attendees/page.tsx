import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import AttendeesPageClient from './AttendeesPageClient';

// Keep in sync with PAGE_SIZE in ./_components/AttendeesTable.tsx — this is
// the exact param shape `useOrders` is called with on first mount (no
// filters), so the prefetched cache entry is picked up instantly instead of
// refetched. Note this resolves to the same cache key as the Orders page's
// prefetch below (both hash to `['orders', { limit: 15 }]`), which is fine —
// they're genuinely the same unfiltered first-page request.
const PAGE_SIZE = 15;

export default async function AttendeesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.orders.all({ limit: PAGE_SIZE }),
    queryFn: async () => {
      const { data, status } = await serverFetch('/orders', {
        params: { limit: PAGE_SIZE },
      });
      if (status < 200 || status >= 300) {
        throw new Error('Failed to prefetch attendees');
      }
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AttendeesPageClient />
    </HydrationBoundary>
  );
}
