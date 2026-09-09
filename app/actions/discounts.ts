'use server';

import { serverFetch } from '@/app/_module/lib/serverFetch';
import type { DiscountByCodeResponseDto } from '@/app/_module/api/types';

export async function getDiscountByCodeAction(
  discountCode: string
): Promise<DiscountByCodeResponseDto> {
  const cleanCode = discountCode.trim();
  if (!cleanCode) {
    throw new Error('Discount code is required');
  }

  const { data, status } = await serverFetch<DiscountByCodeResponseDto>(
    `/discounts/code/${encodeURIComponent(cleanCode)}`
  );

  if (status >= 400) {
    const errorData = data as { message?: string | string[]; error?: string };
    const errorMsg = Array.isArray(errorData?.message)
      ? errorData.message.join(', ')
      : errorData?.message || errorData?.error || 'Discount not found';
    throw new Error(errorMsg);
  }

  return data;
}
