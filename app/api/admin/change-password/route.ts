import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/admin/change-password', { method: 'PATCH', body });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
