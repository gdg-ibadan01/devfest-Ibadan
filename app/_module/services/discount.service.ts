import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type { DiscountByCodeResponseDto } from '@/app/_module/api/types';

export interface AppliedDiscount {
  code: string;
  amount: number;
}

/**
 * DevFest backend generates discount codes as:
 * `${payload.name.slice(0, 3).toUpperCase()}-${randomString(6)}`
 * (3 alphanumeric characters, hyphen '-', and 6 alphanumeric characters).
 * Total length: 10 characters.
 * Example: DEV-A1B2C3
 */
export const DISCOUNT_CODE_REGEX = /^[A-Z0-9]{3}-[A-Z0-9]{6}$/;

export function isValidDiscountCode(code?: string | null): boolean {
  if (!code) return false;
  return DISCOUNT_CODE_REGEX.test(code.trim().toUpperCase());
}

export async function getDiscountByCode(
  discountCode: string
): Promise<DiscountByCodeResponseDto> {
  const cleanCode = discountCode.trim();
  if (!cleanCode) {
    const err = new Error('Please enter a discount code') as Error & { status?: number };
    err.status = 400;
    throw err;
  }

  if (!isValidDiscountCode(cleanCode)) {
    const err = new Error(
      'Invalid discount code format (expected format: XXX-XXXXXX)'
    ) as Error & { status?: number };
    err.status = 400;
    throw err;
  }

  const res = await fetch(
    `/api/v1/discounts/code/${encodeURIComponent(cleanCode)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    let errorMsg = 'Discount not found';
    if (data?.message) {
      errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    } else if (data?.error) {
      errorMsg = typeof data.error === 'string' ? data.error : 'Discount not found';
    } else if (res.status === 404) {
      errorMsg = 'Discount not found';
    } else if (res.status >= 500) {
      errorMsg = 'Unable to verify discount code. Please try again.';
    }

    const error = new Error(errorMsg) as Error & { status?: number; data?: unknown };
    error.status = res.status;
    error.data = data;
    throw error;
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
