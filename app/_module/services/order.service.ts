import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  CreateOrderDto,
  CreateOrderResponseDto,
  OrderListResponseDto,
  OrderListParams,
  GetOrderReferenceResponseDto,
} from '@/app/_module/api/types';

// ---- List orders (replaces the old attendees list) -------------

async function getOrders(params: OrderListParams): Promise<OrderListResponseDto> {
  const { data } = await apiClient.get<OrderListResponseDto>('/orders', { params });
  return data;
}

export function useOrders(params: OrderListParams = {}) {
  return useQuery({
    queryKey: queryKeys.orders.all(params as Record<string, unknown>),
    queryFn: () => getOrders(params),
    placeholderData: (previousData) => previousData,
  });
}

// ---- Create order (manual attendee registration) ----------------

async function createOrder(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
  const { data } = await apiClient.post<CreateOrderResponseDto>('/orders', dto);
  return data;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to create order');
    },
  });
}

// ---- Get order by payment reference ------------------------------

async function getOrderByReference(
  reference: string
): Promise<GetOrderReferenceResponseDto> {
  const { data } = await apiClient.get<GetOrderReferenceResponseDto>(
    `/orders/reference/${encodeURIComponent(reference)}`
  );
  return data;
}

export function useOrderByReference(reference: string) {
  return useQuery({
    queryKey: queryKeys.orders.reference(reference),
    queryFn: () => getOrderByReference(reference),
    enabled: !!reference,
    retry: false,
  });
}
