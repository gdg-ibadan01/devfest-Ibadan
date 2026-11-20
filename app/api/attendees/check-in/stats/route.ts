import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/attendees/check-in/stats   — live check-in numbers for an event day
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/attendees/check-in/stats', {
      req,
    });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
