import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/app/_module/lib/getQueryClient';
import { serverFetch } from '@/app/_module/lib/serverFetch';
import { queryKeys } from '@/app/_module/api/queryKeys';
import DiscountReferralPageClient from './DiscountReferralPageClient';

const DISCOUNTS_LIMIT = 15;
const TICKETS_LIMIT = 50;

export default async function DiscountReferralPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.discounts.all({ limit: DISCOUNTS_LIMIT }),
      queryFn: async () => {
        const { data, status } = await serverFetch('/discounts', {
          params: { limit: DISCOUNTS_LIMIT },
        });
        if (status < 200 || status >= 300) {
          throw new Error('Failed to prefetch discounts');
        }
        return data;
      },
    }),
    queryClient.prefetchQuery({
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
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiscountReferralPageClient />
    </HydrationBoundary>
  );
}
