import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

export async function GET(_req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/roles/permissions');
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
