import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/app/_module/lib/notify';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import type {
  CheckInOrderDto,
  CheckInResponseDto,
  CheckedInListResponseDto,
  CheckedInListParams,
  CheckInStatsParams,
  CheckInStatsResponseDto,
  ScanCheckInDto,
  UndoCheckInResponseDto,
} from '@/app/_module/api/types';
import { notifyApiError } from '../lib/apiError';
import { formatEventTime } from '../lib/eventDate';

// ---- Check in an attendee -------------------------------------
// Listing/creating attendees now lives entirely under the Orders API
// (see orders.service.ts) — the attendees API only handles check-in.

async function checkInAttendee(
  dto: CheckInOrderDto
): Promise<CheckInResponseDto> {
  const { data } = await apiClient.patch<CheckInResponseDto>(
    '/attendees/check-in',
    dto
  );
  return data;
}

/** Toast + cache refresh shared by every check-in path (row, quick, scan). */
function useCheckInEffects() {
  const queryClient = useQueryClient();
  return (res: CheckInResponseDto) => {
    // A second scan of the same ticket on the same day is a no-op on the
    // API — surface it loudly so shared tickets get caught at the door.
    if (res.alreadyCheckedIn) {
      showToast.warning(
        `${res.attendeeFullName} was already checked in today at ${formatEventTime(res.checkedInAt)}`,
        { duration: 6000 }
      );
    } else {
      showToast.success(
        `${res.attendeeFullName} checked in (${res.ticketName})`
      );
    }
    invalidateCheckInQueries(queryClient);
  };
}

function invalidateCheckInQueries(
  queryClient: ReturnType<typeof useQueryClient>
) {
  queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
  queryClient.invalidateQueries({ queryKey: ['attendees'], exact: false });
  queryClient.invalidateQueries({ queryKey: ['dashboard'], exact: false });
}

export function useCheckInAttendee() {
  const onCheckedIn = useCheckInEffects();

  return useMutation({
    mutationFn: checkInAttendee,
    onSuccess: onCheckedIn,
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to check in attendee');
    },
  });
}

// ---- Check in from a scanned QR / typed ticket code -----------

async function scanCheckIn(dto: ScanCheckInDto): Promise<CheckInResponseDto> {
  const { data } = await apiClient.post<CheckInResponseDto>(
    '/attendees/check-in/scan',
    dto
  );
  return data;
}

/**
 * Errors are NOT toasted here — the scanner shows them in its own result
 * card so the door volunteer can't miss a rejected ticket.
 */
export function useScanCheckIn() {
  const onCheckedIn = useCheckInEffects();
  return useMutation({ mutationFn: scanCheckIn, onSuccess: onCheckedIn });
}

// ---- Undo today's check-in -----------------------------------

async function undoCheckIn(
  dto: CheckInOrderDto
): Promise<UndoCheckInResponseDto> {
  const { data } = await apiClient.post<UndoCheckInResponseDto>(
    '/attendees/check-in/undo',
    dto
  );
  return data;
}

export function useUndoCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: undoCheckIn,
    onSuccess: (res) => {
      showToast.info(`Check-in undone for ${res.attendeeFullName}`);
      invalidateCheckInQueries(queryClient);
    },
    onError: (error: Error) => notifyApiError(error, 'Could not undo check-in'),
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
  const { data } = await apiClient.get<CheckedInListResponseDto>(
    '/attendees/checked-in',
    {
      params: { ...rest, eventDates: eventDates.join(',') },
    }
  );
  return data;
}

export function useCheckedInAttendees(params: CheckedInListParams) {
  return useQuery({
    queryKey: queryKeys.attendees.checkedIn(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getCheckedInAttendees(params),
    // Only run once event dates are known (i.e. a ticket has been selected).
    enabled: params.eventDates.length > 0,
    placeholderData: (previousData) => previousData,
  });
}

// ---- Check-in stats -------------------------------------------
// Live expected-vs-checked-in numbers for one event day. Polls while the
// tab is open so the door team and the Home screen stay current.

async function getCheckInStats(
  params: CheckInStatsParams
): Promise<CheckInStatsResponseDto> {
  const { data } = await apiClient.get<CheckInStatsResponseDto>(
    '/attendees/check-in/stats',
    { params }
  );
  return data;
}

export function useCheckInStats(
  params: CheckInStatsParams = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.attendees.checkInStats(
      params as Record<string, unknown>
    ),
    queryFn: () => getCheckInStats(params),
    enabled: options.enabled ?? true,
    refetchInterval: 20_000,
    refetchIntervalInBackground: false,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Every checked-in attendee for these event dates (walks the cursor pages).
 * Used for name-tag printing; capped so a runaway loop can't hang the tab.
 */
export async function fetchAllCheckedIn(
  eventDates: string[],
  maxPages = 100
): Promise<CheckedInListResponseDto['data']> {
  const rows: CheckedInListResponseDto['data'] = [];
  let cursor: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const res = await getCheckedInAttendees({
      eventDates,
      limit: 50,
      cursor,
      direction: cursor ? 'next' : undefined,
    });
    rows.push(...res.data);
    if (!res.meta.hasMore || !res.meta.nextCursor) break;
    cursor = res.meta.nextCursor;
  }
  return rows;
}
