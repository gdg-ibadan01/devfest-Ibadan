import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// POST /api/email-campaigns/audience-count  — how many ticket holders match a filter
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/email-campaigns/audience-count', {
      method: 'POST',
      body,
    });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
