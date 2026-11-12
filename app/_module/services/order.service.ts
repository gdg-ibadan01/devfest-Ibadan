import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  CreateOrderDto,
  CreateOrderResponseDto,
  CreateGroupBuyOrderDto,
  CreateGroupBuyOrderResponseDto,
  OrderListResponseDto,
  OrderListParams,
  OrderExportParams,
  OrderExportResponseDto,
  OrderListItemDto,
  GetOrderReferenceResponseDto,
  AdminCreateOrderDto,
  CheckoutSessionResponse,
  VerifyCheckoutDto,
  VerifyCheckoutResponse,
} from '@/app/_module/api/types';

// ---- List orders (replaces the old attendees list) -------------

async function getOrders(
  params: OrderListParams
): Promise<OrderListResponseDto> {
  const { data } = await apiClient.get<OrderListResponseDto>('/orders', {
    params,
  });
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

// ---- Export orders (audit-logged by the API) ---------------------

export async function exportOrders(
  params: OrderExportParams
): Promise<OrderExportResponseDto> {
  const { data } = await apiClient.get<OrderExportResponseDto>(
    '/orders/export',
    { params }
  );
  return data;
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

  while (
    matches.length < pageSize &&
    sourceHasMore &&
    scannedPages < CHECK_IN_SCAN_MAX_PAGES
  ) {
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
      const isMatch = checkedIn
        ? order.checkIns.length > 0
        : order.checkIns.length === 0;
      if (isMatch) {
        matches.push(order);
        if (matches.length === pageSize) break;
      }
    }

    sourceHasMore = page.meta?.hasMore ?? false;
  }

  const scanLimitReached =
    scannedPages >= CHECK_IN_SCAN_MAX_PAGES &&
    matches.length < pageSize &&
    sourceHasMore;

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
    queryKey: queryKeys.orders.checkInFiltered({
      search,
      checkedIn,
      cursor,
      pageSize,
    }),
    queryFn: () =>
      fetchCheckInFilteredPage({ search, checkedIn, cursor, pageSize }),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}

// ---- Create order (manual attendee registration) ----------------

async function createOrder(
  dto: CreateOrderDto
): Promise<CreateOrderResponseDto> {
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

// ---- Create group buy order --------------------------------------

async function createGroupBuyOrder(
  dto: CreateGroupBuyOrderDto
): Promise<CreateGroupBuyOrderResponseDto> {
  const { data } = await apiClient.post<CreateGroupBuyOrderResponseDto>(
    '/orders/group-buys',
    dto
  );
  return data;
}

export function useCreateGroupBuyOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroupBuyOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to create group order');
    },
  });
}

// ---- Create order on behalf of an attendee (admin-only) -----------
// Distinct from the public `/orders` endpoint above — this is what the
// admin dashboard's "Create New Order" flow should use, since it also
// allows admins to bypass ticket sale-window checks via `skipSaleWindowCheck`.

async function createOrderForAttendee(
  dto: AdminCreateOrderDto
): Promise<CreateOrderResponseDto> {
  const { data } = await apiClient.post<CreateOrderResponseDto>(
    '/orders/attendees',
    dto
  );
  return data;
}

export function useCreateOrderForAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderForAttendee,
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

/** True when the API said the order doesn't exist (vs. a temporary failure). */
export function isNotFound(error: unknown): boolean {
  return (error as { status?: number } | null)?.status === 404;
}

export function useOrderByReference(reference: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.reference(reference ?? ''),
    queryFn: () => getOrderByReference(reference!),
    enabled: !!reference,
    // Give the payment webhook time to confirm the order after the popup
    // closes. Bank transfers can take minutes, so poll for up to ~15 minutes.
    refetchInterval: (query) => {
      // Keep trying through a temporary outage (anything but "not found").
      if (query.state.status === 'error') {
        return !isNotFound(query.state.error) &&
          query.state.errorUpdateCount < 60
          ? 5000
          : false;
      }
      return query.state.data?.status === 'AWAITING_PAYMENT' &&
        query.state.dataUpdateCount < 180
        ? 5000
        : false;
    },
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 2,
  });
}

// ---- Checkout (gateway-agnostic) ---------------------------------

/** Asks the API to re-query the gateway and confirm a popup payment. */
export async function verifyCheckout(
  dto: VerifyCheckoutDto
): Promise<VerifyCheckoutResponse> {
  const { data } = await apiClient.post<VerifyCheckoutResponse>(
    '/checkout/verify',
    dto
  );
  return data;
}

/** Re-issues the inline checkout for an unpaid order (pay link / retry). */
export async function getCheckoutSession(
  reference: string
): Promise<CheckoutSessionResponse> {
  const { data } = await apiClient.get<CheckoutSessionResponse>(
    `/checkout/${encodeURIComponent(reference)}`
  );
  return data;
}
