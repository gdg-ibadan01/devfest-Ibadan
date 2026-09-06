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
  OrderListItemDto,
  GetOrderReferenceResponseDto,
} from '@/app/_module/api/types';

// ---- List orders (replaces the old attendees list) -------------

async function getOrders(params: OrderListParams): Promise<OrderListResponseDto> {
  const { data } = await apiClient.get<OrderListResponseDto>('/orders', { params });
  return data;
}

export function useOrders(
  params: OrderListParams = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.orders.all(params as Record<string, unknown>),
    queryFn: () => getOrders(params),
    placeholderData: (previousData) => previousData,
    enabled: options.enabled ?? true,
  });
}

// ---- Check-in-filtered orders (client-side scan) -----------------
// The /orders endpoint has no check-in-status filter param, so filtering by
// check-in state can't be done for a single page the way the status filter
// is — a naive "filter the current page of 15" approach shows an empty
// table whenever the matching attendees simply aren't on that page. Instead,
// we scan forward through sequential /orders pages (each at the API's max
// limit) accumulating matches until a full display page is filled or the
// source data is exhausted, capped at CHECK_IN_SCAN_MAX_PAGES to bound how
// many requests a single scan can make.

const CHECK_IN_SCAN_PAGE_LIMIT = 50; // API's max `limit` per request
const CHECK_IN_SCAN_MAX_PAGES = 20; // safety cap: scans at most 1000 source orders per display page

export interface CheckInFilteredPage {
  data: OrderListItemDto[];
  /** Cursor to resume scanning from for the next display page. */
  resumeCursor?: string;
  /** Whether more matching (or potentially-matching) data may exist beyond this page. */
  hasMore: boolean;
  /** True if the scan hit the page cap before filling a full page or exhausting the source data — there may be further matches we haven't looked at yet. */
  scanLimitReached: boolean;
}

async function fetchCheckInFilteredPage({
  search,
  checkedIn,
  cursor,
  pageSize,
}: {
  search?: string;
  checkedIn: boolean;
  cursor?: string;
  pageSize: number;
}): Promise<CheckInFilteredPage> {
  let sourceCursor = cursor;
  const matches: OrderListItemDto[] = [];
  let sourceHasMore = true;
  let scannedPages = 0;

  while (matches.length < pageSize && sourceHasMore && scannedPages < CHECK_IN_SCAN_MAX_PAGES) {
    const page = await getOrders({
      limit: CHECK_IN_SCAN_PAGE_LIMIT,
      search,
      cursor: sourceCursor,
      direction: 'next',
    });
    scannedPages += 1;

    if (page.data.length === 0) {
      sourceHasMore = false;
      break;
    }

    for (const order of page.data) {
      sourceCursor = order.id;
      // checkIns is populated by the backend as an array of check-in
      // timestamps — an attendee is checked in whenever it's non-empty,
      // regardless of how many times they've been scanned in.
      const isMatch = checkedIn ? order.checkIns.length > 0 : order.checkIns.length === 0;
      if (isMatch) {
        matches.push(order);
        if (matches.length === pageSize) break;
      }
    }

    sourceHasMore = page.meta?.hasMore ?? false;
  }

  const scanLimitReached =
    scannedPages >= CHECK_IN_SCAN_MAX_PAGES && matches.length < pageSize && sourceHasMore;

  return {
    data: matches,
    resumeCursor: sourceCursor,
    // Optimistic: either we already filled a full page (there may be more
    // matches beyond it) or the source itself still has unscanned data.
    hasMore: matches.length >= pageSize || sourceHasMore,
    scanLimitReached,
  };
}

export function useCheckInFilteredOrders({
  search,
  checkedIn,
  cursor,
  pageSize = 15,
  enabled = true,
}: {
  search?: string;
  checkedIn: boolean;
  cursor?: string;
  pageSize?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.orders.checkInFiltered({ search, checkedIn, cursor, pageSize }),
    queryFn: () => fetchCheckInFilteredPage({ search, checkedIn, cursor, pageSize }),
    placeholderData: (previousData) => previousData,
    enabled,
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
