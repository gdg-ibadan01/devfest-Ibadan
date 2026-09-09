import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/orders/attendees', {
      method: 'POST',
      body,
    });
    return apiResponse(data, status);
  } catch (error) {
    return handleRouteError(error);
  }
}
