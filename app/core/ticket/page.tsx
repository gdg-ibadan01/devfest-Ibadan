import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import TicketPageClient from './TicketPageClient';

// Keep in sync with the `limit` TicketTable.tsx calls `useTickets` with on
// first mount (no filters) so the prefetched cache entry is reused instantly.
const PAGE_SIZE = 10;

export default async function TicketsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tickets.all({ limit: PAGE_SIZE }),
    queryFn: async () => {
      const { data, status } = await serverFetch('/tickets', {
        params: { limit: PAGE_SIZE },
      });
      if (status < 200 || status >= 300) {
        throw new Error('Failed to prefetch tickets');
      }
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TicketPageClient />
    </HydrationBoundary>
  );
}
