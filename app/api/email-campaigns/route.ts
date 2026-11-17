import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/email-campaigns  — list;  POST — create a draft
export async function GET() {
  try {
    const { data, status } = await serverFetch('/email-campaigns');
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/email-campaigns', {
      method: 'POST',
      body,
    });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
