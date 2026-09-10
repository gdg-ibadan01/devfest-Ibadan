import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET /api/attendees/checked-in   — list checked-in attendees for a ticket's event dates
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/attendees/checked-in', { req });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
