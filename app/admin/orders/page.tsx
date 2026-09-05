import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import OrdersPageClient from './OrdersPageClient';

// Keep in sync with PAGE_SIZE in ./_components/OrdersTable.tsx — this is the
// exact param shape `useOrders` is called with on first mount (no filters),
// so the prefetched cache entry is picked up instantly instead of refetched.
const PAGE_SIZE = 15;

export default async function OrdersPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.orders.all({ limit: PAGE_SIZE }),
    queryFn: async () => {
      const { data, status } = await serverFetch('/orders', {
        params: { limit: PAGE_SIZE },
      });
      if (status < 200 || status >= 300) {
        throw new Error('Failed to prefetch orders');
      }
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersPageClient />
    </HydrationBoundary>
  );
}
