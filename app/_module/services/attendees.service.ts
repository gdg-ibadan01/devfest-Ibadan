import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  CheckInOrderDto,
  CheckInResponseDto,
  CheckedInListResponseDto,
  CheckedInListParams,
} from '@/app/_module/api/types';
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
      queryClient.invalidateQueries({ queryKey: ['attendees', 'checked-in'], exact: false });
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to check in attendee');
    },
  });
}

// ---- List checked-in attendees ---------------------------------
// Powers the "Checkins" tab: cursor-paginated list of attendees who have
// checked in against a specific ticket's event dates.

async function getCheckedInAttendees(
  params: CheckedInListParams
): Promise<CheckedInListResponseDto> {
  // Send eventDates as a single comma-separated value (matches the
  // backend's `@Transform` on `CheckedInQueryDto`, which accepts a
  // comma-separated string as well as a repeated array) — this avoids any
  // ambiguity around how a string[] query param gets serialized as it
  // passes through axios and the Next.js API proxy route.
  const { eventDates, ...rest } = params;
  const { data } = await apiClient.get<CheckedInListResponseDto>('/attendees/checked-in', {
    params: { ...rest, eventDates: eventDates.join(',') },
  });
  return data;
}

export function useCheckedInAttendees(params: CheckedInListParams) {
  return useQuery({
    queryKey: queryKeys.attendees.checkedIn(params as unknown as Record<string, unknown>),
    queryFn: () => getCheckedInAttendees(params),
    // Only run once event dates are known (i.e. a ticket has been selected).
    enabled: params.eventDates.length > 0,
    placeholderData: (previousData) => previousData,
  });
}
