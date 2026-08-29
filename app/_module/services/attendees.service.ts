import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type { CreateAttendeeDto, PaginationParams } from '@/app/_module/api/types';

// ---- List attendees -----------------------------------------

async function getAttendees(params: PaginationParams): Promise<unknown> {
  const { data } = await apiClient.get('/attendees', { params });
  return data;
}

export function useAttendees(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.attendees.all(params as Record<string, unknown>),
    queryFn: () => getAttendees(params),
  });
}

// ---- Get attendee -------------------------------------------

async function getAttendee(id: string): Promise<unknown> {
  const { data } = await apiClient.get(`/attendees/${id}`);
  return data;
}

export function useAttendee(id: string) {
  return useQuery({
    queryKey: queryKeys.attendees.detail(id),
    queryFn: () => getAttendee(id),
    enabled: !!id,
  });
}

// ---- Create attendee (manual registration) ------------------

async function createAttendee(dto: CreateAttendeeDto): Promise<unknown> {
  const { data } = await apiClient.post('/attendees', dto);
  return data;
}

export function useCreateAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendee,
    onSuccess: () => {
      showToast.success('Attendee registered successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.attendees.all() });
    },
    onError: (error: Error) => {
      showToast.error(error.message || 'Failed to register attendee');
    },
  });
}
