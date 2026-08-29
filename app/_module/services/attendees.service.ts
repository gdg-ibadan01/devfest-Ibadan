import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  CreateAttendeeDto,
  AttendeeDto,
  AttendeeListResponseDto,
  AttendeeListParams,
} from '@/app/_module/api/types';

// ---- List attendees -----------------------------------------

async function getAttendees(params: AttendeeListParams): Promise<AttendeeListResponseDto> {
  const { data } = await apiClient.get<AttendeeListResponseDto>('/attendees', { params });
  return data;
}

export function useAttendees(params: AttendeeListParams = {}) {
  return useQuery({
    queryKey: queryKeys.attendees.all(params as Record<string, unknown>),
    queryFn: () => getAttendees(params),
  });
}

// ---- Get single attendee ------------------------------------

async function getAttendee(id: string): Promise<AttendeeDto> {
  const { data } = await apiClient.get<AttendeeDto>(`/attendees/${id}/retrieve`);
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

async function createAttendee(dto: CreateAttendeeDto): Promise<void> {
  await apiClient.post('/attendees', dto);
}

export function useCreateAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendee,
    onSuccess: () => {
      showToast.success('Attendee registered successfully');
      queryClient.invalidateQueries({ queryKey: ['attendees'], exact: false });
    },
    onError: (error: Error) => {
      showToast.error(error.message || 'Failed to register attendee');
    },
  });
}
