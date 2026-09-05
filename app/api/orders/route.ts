import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET  /api/orders   — cursor-paginated list of orders (search/status/direction/cursor/limit forwarded)
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/orders', { req });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

// POST /api/orders   — create a ticket order (used by the admin "add attendee" flow)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/orders', { method: 'POST', body });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
