'use server';

import { serverFetch } from '@/app/_module/lib/serverFetch';
import type {
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrderReferenceResponseDto,
} from '@/app/_module/api/types';

export async function createOrderAction(
  dto: CreateOrderDto
): Promise<CreateOrderResponseDto> {
  const { data, status } = await serverFetch<CreateOrderResponseDto>('/orders', {
    method: 'POST',
    body: dto,
  });

  if (status >= 400) {
    const errorData = data as { message?: string | string[]; error?: string };
    const errorMsg = Array.isArray(errorData?.message)
      ? errorData.message.join(', ')
      : errorData?.message || errorData?.error || 'Failed to create order';
    throw new Error(errorMsg);
  }

  return data;
}

export async function getOrderByReferenceAction(
  reference: string
): Promise<GetOrderReferenceResponseDto> {
  const { data, status } = await serverFetch<GetOrderReferenceResponseDto>(
    `/orders/reference/${reference}`
  );

  if (status >= 400) {
    const errorData = data as { message?: string | string[]; error?: string };
    const errorMsg = Array.isArray(errorData?.message)
      ? errorData.message.join(', ')
      : errorData?.message || errorData?.error || 'Failed to retrieve order';
    throw new Error(errorMsg);
  }

  return data;
}
