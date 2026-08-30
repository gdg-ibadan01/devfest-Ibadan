import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET  /api/tickets   — list tickets (cursor pagination forwarded)
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/tickets', { req });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

// POST /api/tickets   — create ticket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/tickets', { method: 'POST', body });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
