import { useMutation } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import type {
  CreateOrderDto,
  CreateOrderResponseDto,
} from '@/app/_module/api/types';

// ---- Create order -------------------------------------------

async function createOrder(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
  const { data } = await apiClient.post<CreateOrderResponseDto>('/orders', dto);
  return data;
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
    onError: (error: Error) => {
      showToast.error(error.message || 'Failed to create order');
    },
  });
}
