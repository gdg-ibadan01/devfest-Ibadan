import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET  /api/attendees   — list attendees
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/attendees', { req });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

// POST /api/attendees   — create attendee
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/attendees', { method: 'POST', body });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
