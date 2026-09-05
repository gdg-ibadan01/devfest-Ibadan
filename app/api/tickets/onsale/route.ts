import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET  /api/tickets/onsale   — list currently on-sale tickets (used for the "add attendee" order form)
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/tickets/onsale', { req });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
