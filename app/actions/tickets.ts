'use server';

import { serverFetch } from '@/app/_module/lib/serverFetch';
import type { OnSaleTicketResponseDto } from '@/app/_module/api/types';

export async function getTicketsOnSaleAction(
  name?: string
): Promise<OnSaleTicketResponseDto> {
  const { data, status } = await serverFetch<OnSaleTicketResponseDto>(
    '/tickets/onsale',
    {
      params: name ? { name } : undefined,
    }
  );

  if (status >= 400) {
    const errorData = data as { message?: string | string[]; error?: string };
    const errorMsg = Array.isArray(errorData?.message)
      ? errorData.message.join(', ')
      : errorData?.message || errorData?.error || 'Failed to fetch tickets on sale';
    throw new Error(errorMsg);
  }

  return data;
}
