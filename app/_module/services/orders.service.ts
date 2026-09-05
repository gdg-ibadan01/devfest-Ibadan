import { useMutation, useQuery } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { queryKeys } from '@/app/_module/api/queryKeys';
import {
  createOrderAction,
  getOrderByReferenceAction,
} from '@/app/actions/orders';
import type {
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrderReferenceResponseDto,
} from '@/app/_module/api/types';

// ---- Create order -------------------------------------------

async function createOrder(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
  return await createOrderAction(dto);
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
    onError: (error: Error) => {
      showToast.error(error.message || 'Failed to create order');
    },
  });
}

// ---- Get order by reference ---------------------------------

async function getOrderByReference(
  reference: string
): Promise<GetOrderReferenceResponseDto> {
  return await getOrderByReferenceAction(reference);
}

export function useOrderByReference(reference: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.byReference(reference ?? ''),
    queryFn: () => getOrderByReference(reference!),
    enabled: !!reference,
    retry: 1,
  });
}
