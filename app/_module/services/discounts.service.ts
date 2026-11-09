import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  CreateDiscountDto,
  CreateDiscountResponseDto,
  DiscountListResponseDto,
  DiscountListParams,
  UpdateDiscountDto,
} from '@/app/_module/api/types';

// ---- List discounts -------------------------------------------------

async function getDiscounts(params: DiscountListParams): Promise<DiscountListResponseDto> {
  const { data } = await apiClient.get<DiscountListResponseDto>('/discounts', { params });
  return data;
}

export function useDiscounts(params: DiscountListParams = {}) {
  return useQuery({
    queryKey: queryKeys.discounts.all(params as Record<string, unknown>),
    queryFn: () => getDiscounts(params),
    placeholderData: (previousData) => previousData,
  });
}

// ---- Create discount -------------------------------------------------

async function createDiscount(dto: CreateDiscountDto): Promise<CreateDiscountResponseDto> {
  const { data } = await apiClient.post<CreateDiscountResponseDto>('/discounts', dto);
  return data;
}

// ---- Update discount expiry ----------------------------------------

async function updateDiscount({
  discountId,
  dto,
}: {
  discountId: string;
  dto: UpdateDiscountDto;
}): Promise<CreateDiscountResponseDto> {
  const { data } = await apiClient.patch<CreateDiscountResponseDto>(
    `/discounts/${encodeURIComponent(discountId)}`,
    dto
  );

  return data;
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDiscount,
    onSuccess: (updatedDiscount) => {
      queryClient.setQueriesData<DiscountListResponseDto>(
        { queryKey: ['discounts'], exact: false },
        (currentData) => {
          if (!currentData) return currentData;

          return {
            ...currentData,
            data: currentData.data.map((discount) =>
              discount.id === updatedDiscount.id
                ? {
                    ...discount,
                    validTo: updatedDiscount.validTo,
                  }
                : discount
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ['discounts'],
        exact: false,
      });

      showToast.success('Discount updated successfully');
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to update discount');
    },
  });
}

export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'], exact: false });
      showToast.success('Discount created successfully');
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to create discount');
    },
  });
}
