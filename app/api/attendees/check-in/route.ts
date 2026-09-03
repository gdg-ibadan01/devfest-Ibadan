import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// PATCH /api/attendees/check-in   — check in an attendee by order id
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/attendees/check-in', {
      method: 'PATCH',
      body,
    });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
