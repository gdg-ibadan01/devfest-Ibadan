import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import CheckinsPageClient from './CheckinsPageClient';

// Keep in sync with the `limit` CheckinsTable.tsx calls `useTickets` with —
// this powers the ticket-select dropdown and is prefetched here so the
// dropdown is populated instantly. The checked-in attendees list itself
// can't be prefetched since no ticket is selected on first load.
const TICKETS_LIMIT = 50;

export default async function CheckinsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tickets.all({ limit: TICKETS_LIMIT }),
    queryFn: async () => {
      const { data, status } = await serverFetch('/tickets', {
        params: { limit: TICKETS_LIMIT },
      });
      if (status < 200 || status >= 300) {
        throw new Error('Failed to prefetch tickets');
      }
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckinsPageClient />
    </HydrationBoundary>
  );
}
