import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/audit-logs', { req });
    return apiResponse(data, status);
  } catch (error) {
    return handleRouteError(error);
  }
}
