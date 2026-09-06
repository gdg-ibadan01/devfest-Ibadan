import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { getTicketsOnSaleAction } from '@/app/actions/tickets';
import type {
  CreateTicketDto,
  CreateTicketResponseDto,
  TicketListResponseDto,
  GetTicketResponseDto,
  TicketListParams,
  OnSaleTicketResponseDto,
} from '@/app/_module/api/types';

// ---- List tickets -------------------------------------------

async function getTickets(params: TicketListParams): Promise<TicketListResponseDto> {
  const { data } = await apiClient.get<TicketListResponseDto>('/tickets', { params });
  return data;
}

export function useTickets(params: TicketListParams = {}) {
  return useQuery({
    queryKey: queryKeys.tickets.all(params as Record<string, unknown>),
    queryFn: () => getTickets(params),
  });
}

// ---- Get tickets on sale ------------------------------------

async function getTicketsOnSale(name?: string): Promise<OnSaleTicketResponseDto> {
  return await getTicketsOnSaleAction(name);
}

export function useTicketsOnSale(name?: string) {
  return useQuery({
    queryKey: queryKeys.tickets.onSale(name ? { name } : undefined),
    queryFn: () => getTicketsOnSale(name),
  });
}

// ---- Get ticket ---------------------------------------------

async function getTicket(id: string): Promise<GetTicketResponseDto> {
  const { data } = await apiClient.get<GetTicketResponseDto>(`/tickets/${id}`);
  return data;
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: () => getTicket(id),
    enabled: !!id,
  });
}

// ---- Create ticket ------------------------------------------

async function createTicket(dto: CreateTicketDto): Promise<CreateTicketResponseDto> {
  const { data } = await apiClient.post<CreateTicketResponseDto>('/tickets', dto);
  return data;
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      showToast.success('Ticket created successfully');
      // Invalidate all ticket list queries regardless of params
      queryClient.invalidateQueries({ queryKey: ['tickets'], exact: false });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to create ticket');
    },
  });
}

// ---- Update ticket ------------------------------------------

async function updateTicket({
  id,
  dto,
}: {
  id: string;
  dto: Partial<CreateTicketDto>;
}): Promise<void> {
  await apiClient.patch(`/tickets/${id}`, dto);
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTicket,
    onSuccess: (_data, { id }) => {
      showToast.success('Ticket updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tickets'], exact: false });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(id) });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to update ticket');
    },
  });
}

// ---- On-sale tickets (for the admin "add attendee" order form) -----

async function getOnSaleTickets(): Promise<OnSaleTicketResponseDto> {
  const { data } = await apiClient.get<OnSaleTicketResponseDto>('/tickets/onsale');
  return data;
}

export function useOnSaleTickets() {
  return useQuery({
    queryKey: queryKeys.tickets.onSale(),
    queryFn: getOnSaleTickets,
  });
}
