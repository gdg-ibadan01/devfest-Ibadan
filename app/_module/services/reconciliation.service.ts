import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { showToast } from '@/app/_module/lib/notify';
import { notifyApiError } from '../lib/apiError';
import type {
  ReconcileConfirmResponseDto,
  ReconciliationResponseDto,
  VerifyCheckoutDto,
  VerifyCheckoutResponse,
} from '@/app/_module/api/types';

// ---- "Paid on ALATPay, not PAID here" ------------------------------

async function getReconciliation(
  hours: number
): Promise<ReconciliationResponseDto> {
  const { data } = await apiClient.get<ReconciliationResponseDto>(
    '/checkout/admin/reconciliation',
    { params: { hours } }
  );
  return data;
}

export function useReconciliation(hours: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.reconciliation(hours),
    queryFn: () => getReconciliation(hours),
    enabled,
    // Gateway call — don't hammer it on every focus.
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

const OUTCOME_MESSAGES: Record<string, string> = {
  PROCESSED: 'Payment confirmed — ticket issued',
  DUPLICATE: 'Already processed earlier',
  NOT_COMPLETED: 'ALATPay does not show this payment as completed yet',
  REJECTED: 'Rejected — the transaction does not match the order',
  IGNORED: 'Nothing to do',
  ALREADY_FINAL: 'Order is no longer awaiting payment',
};

export function describeOutcome(outcome: string, reason?: string | null) {
  const base = OUTCOME_MESSAGES[outcome] ?? outcome;
  return reason ? `${base} (${reason})` : base;
}

async function confirmReconciliation(
  transactionRef: string
): Promise<ReconcileConfirmResponseDto> {
  const { data } = await apiClient.post<ReconcileConfirmResponseDto>(
    '/checkout/admin/reconciliation/confirm',
    { transactionRef }
  );
  return data;
}

export function useConfirmReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmReconciliation,
    onSuccess: (res) => {
      const message = describeOutcome(res.outcome, res.reason);
      if (res.outcome === 'PROCESSED' || res.outcome === 'DUPLICATE') {
        showToast.success(message);
      } else {
        showToast.warning(message, { duration: 6000 });
      }
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] });
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['dashboard'], exact: false });
    },
    onError: (error: Error) =>
      notifyApiError(error, 'Could not confirm payment'),
  });
}

// ---- Re-check one order with its gateway (any provider) -------------

async function requeryPayment(
  dto: VerifyCheckoutDto
): Promise<VerifyCheckoutResponse> {
  const { data } = await apiClient.post<VerifyCheckoutResponse>(
    '/checkout/requery',
    dto
  );
  return data;
}

/** Toasting is left to the caller: walk-in and Orders show it differently. */
export function useRequeryPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requeryPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] });
    },
  });
}
