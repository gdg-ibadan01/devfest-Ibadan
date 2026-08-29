import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';
import type { LoginResponseDto } from '@/app/_module/api/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch<LoginResponseDto>('/admin/refresh', {
      method: 'POST',
      body,
    });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
