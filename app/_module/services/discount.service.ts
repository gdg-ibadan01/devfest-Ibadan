import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type { DiscountByCodeResponseDto } from '@/app/_module/api/types';

export interface AppliedDiscount {
  code: string;
  amount: number;
}

export async function getDiscountByCode(
  discountCode: string
): Promise<DiscountByCodeResponseDto> {
  const cleanCode = discountCode.trim();
  if (!cleanCode) {
    throw new Error('Please enter a discount code');
  }

  const res = await fetch(
    `/api/v1/discounts/code/${encodeURIComponent(cleanCode)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.message ||
      (Array.isArray(data?.message) ? data.message.join(', ') : 'Discount not found');
    throw new Error(errorMsg);
  }

  return data as DiscountByCodeResponseDto;
}

// React Query hook to fetch discount by code
export function useDiscountByCode(
  code: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.discounts.byCode(code),
    queryFn: () => getDiscountByCode(code),
    enabled: options.enabled ?? (!!code && code.trim().length > 0),
    retry: false,
  });
}

// React Query mutation hook to apply discount on button click
export function useApplyDiscount() {
  return useMutation({
    mutationFn: (code: string) => getDiscountByCode(code),
    retry: false,
  });
}
