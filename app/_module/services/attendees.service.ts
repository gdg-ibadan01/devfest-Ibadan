import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import type { CheckInOrderDto, CheckInResponseDto } from '@/app/_module/api/types';
import { notifyApiError } from '../lib/apiError';

// ---- Check in an attendee -------------------------------------
// Listing/creating attendees now lives entirely under the Orders API
// (see orders.service.ts) — the attendees API only handles check-in.

async function checkInAttendee(dto: CheckInOrderDto): Promise<CheckInResponseDto> {
  const { data } = await apiClient.patch<CheckInResponseDto>('/attendees/check-in', dto);
  return data;
}

export function useCheckInAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkInAttendee,
    onSuccess: () => {
      showToast.success('Attendee checked in successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to check in attendee');
    },
  });
}
