import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { showToast } from '@/app/_module/lib/notify';
import type {
  PaymentGatewayName,
  PaymentGatewayStatus,
} from '@/app/_module/api/types';

export function usePaymentGateway() {
  return useQuery({
    queryKey: queryKeys.paymentGateway.status(),
    queryFn: async () =>
      (await apiClient.get<PaymentGatewayStatus>('/payment-gateway')).data,
  });
}

export function useSetPaymentGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (provider: PaymentGatewayName) =>
      (
        await apiClient.put<PaymentGatewayStatus>('/payment-gateway', {
          provider,
        })
      ).data,
    onSuccess: (status) => {
      queryClient.setQueryData(queryKeys.paymentGateway.status(), status);
      const label =
        status.providers.find((p) => p.name === status.active)?.label ??
        status.active;
      showToast.success(`New orders now pay with ${label}`);
    },
    onError: (error: Error) =>
      notifyApiError(error, 'Failed to switch payment gateway'),
  });
}
