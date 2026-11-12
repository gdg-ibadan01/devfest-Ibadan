import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { showToast } from '@/app/_module/lib/notify';
import type {
  CampaignAudience,
  EmailCampaignDto,
  EmailDeliveriesResponse,
  ResendBulkResult,
  SaveEmailCampaignDto,
  TicketEmailSummary,
} from '@/app/_module/api/types';

// ---- Campaigns -------------------------------------------------------

export function useEmailCampaigns() {
  return useQuery({
    queryKey: queryKeys.emails.campaigns(),
    queryFn: async () =>
      (await apiClient.get<EmailCampaignDto[]>('/email-campaigns')).data,
    // Sending campaigns progress in the background, so keep the list fresh.
    refetchInterval: (query) =>
      query.state.data?.some((c) => c.status === 'SENDING') ? 5000 : false,
  });
}

export function useEmailCampaign(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.emails.campaign(id ?? ''),
    queryFn: async () =>
      (await apiClient.get<EmailCampaignDto>(`/email-campaigns/${id}`)).data,
    enabled: Boolean(id),
    refetchInterval: (query) =>
      query.state.data?.status === 'SENDING' ? 4000 : false,
  });
}

export function useCampaignDeliveries(
  id: string | undefined,
  params: { status?: string; page?: number; limit?: number } = {},
  options: { refetch?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.emails.deliveries(id ?? '', params),
    queryFn: async () =>
      (
        await apiClient.get<EmailDeliveriesResponse>(
          `/email-campaigns/${id}/deliveries`,
          { params }
        )
      ).data,
    enabled: Boolean(id),
    placeholderData: (previous) => previous,
    refetchInterval: options.refetch ? 5000 : false,
  });
}

export function useAudienceCount(audience: CampaignAudience) {
  return useQuery({
    queryKey: queryKeys.emails.audienceCount(
      audience as Record<string, unknown>
    ),
    queryFn: async () =>
      (
        await apiClient.post<{ count: number }>(
          '/email-campaigns/audience-count',
          { audience }
        )
      ).data.count,
    placeholderData: (previous) => previous,
  });
}

export function useSaveEmailCampaign(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: SaveEmailCampaignDto) =>
      id
        ? (await apiClient.patch<EmailCampaignDto>(`/email-campaigns/${id}`, dto))
            .data
        : (await apiClient.post<EmailCampaignDto>('/email-campaigns', dto)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'campaigns'] });
    },
    onError: (error: Error) => notifyApiError(error, 'Failed to save draft'),
  });
}

export function useDeleteEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete(`/email-campaigns/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'campaigns'] });
      showToast.success('Draft deleted');
    },
    onError: (error: Error) => notifyApiError(error, 'Failed to delete draft'),
  });
}

export function useSendTestEmail() {
  return useMutation({
    mutationFn: async ({ id, emails }: { id: string; emails: string[] }) =>
      (
        await apiClient.post<{
          sent: string[];
          failed: { email: string; error: string }[];
        }>(`/email-campaigns/${id}/test`, { emails })
      ).data,
    onSuccess: ({ sent, failed }) => {
      if (sent.length) {
        showToast.success(
          `Test sent to ${sent.length === 1 ? sent[0] : `${sent.length} addresses`}`
        );
      }
      if (failed.length) {
        showToast.error(
          `Could not send to ${failed.map((f) => f.email).join(', ')}: ${failed[0].error}`
        );
      }
    },
    onError: (error: Error) => notifyApiError(error, 'Failed to send test email'),
  });
}

export function useSendEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiClient.post<{ queued: number }>(`/email-campaigns/${id}/send`)
      ).data,
    onSuccess: ({ queued }) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast.success(`Sending to ${queued.toLocaleString()} ticket holders`);
    },
    onError: (error: Error) => notifyApiError(error, 'Failed to send email'),
  });
}

export function useRetryFailedDeliveries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiClient.post<{ requeued: number }>(
          `/email-campaigns/${id}/retry-failed`
        )
      ).data,
    onSuccess: ({ requeued }) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      showToast.success(
        requeued ? `Retrying ${requeued} failed emails` : 'Nothing to retry'
      );
    },
    onError: (error: Error) => notifyApiError(error, 'Failed to retry'),
  });
}

// ---- Ticket confirmation emails (per order) ---------------------------

export function useTicketEmailSummary() {
  return useQuery({
    queryKey: queryKeys.emails.ticketSummary(),
    queryFn: async () =>
      (await apiClient.get<TicketEmailSummary>('/orders/ticket-emails/summary'))
        .data,
  });
}

export function useResendTicketEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) =>
      (
        await apiClient.post<{ sent: boolean; deferred: boolean }>(
          `/orders/${orderId}/resend-ticket`
        )
      ).data,
    onSuccess: ({ sent, deferred }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.emails.ticketSummary() });
      if (sent) showToast.success('Ticket email sent');
      else if (deferred) {
        showToast.info(
          'The mail sending limit is used up. It is queued and will go out automatically.'
        );
      } else showToast.error('The mail provider rejected it. It will be retried automatically.');
    },
    onError: (error: Error) => notifyApiError(error, 'Failed to resend ticket'),
  });
}

export function useResendUnconfirmedTickets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await apiClient.post<ResendBulkResult>('/orders/resend-tickets')).data,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.emails.ticketSummary() });
      const parts = [`${result.sent} sent`];
      if (result.failed) parts.push(`${result.failed} failed`);
      if (result.remaining) {
        parts.push(`${result.remaining.toLocaleString()} still unconfirmed`);
      }
      if (result.deferred) {
        parts.push('mail limit reached — the rest are queued and send automatically');
      }
      showToast.info(parts.join(' · '));
    },
    onError: (error: Error) => notifyApiError(error, 'Failed to resend tickets'),
  });
}

// ---- Live preview ---------------------------------------------------

export function useEmailPreview(content: {
  subject: string;
  preheader: string;
  body: string;
}) {
  return useQuery({
    queryKey: ['emails', 'preview', content] as const,
    queryFn: async () =>
      (
        await apiClient.post<{ html: string; subject: string }>(
          '/email-campaigns/preview',
          content
        )
      ).data,
    enabled: content.subject.trim().length > 0 && content.body.trim().length > 0,
    placeholderData: (previous) => previous,
    staleTime: Infinity,
  });
}
