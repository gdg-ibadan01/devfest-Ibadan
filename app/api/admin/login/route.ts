import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';
import { setTokens } from '@/app/actions/auth';
import type { LoginResponseDto } from '@/app/_module/api/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch<LoginResponseDto>('/admin/login', {
      method: 'POST',
      body,
    });

    if (status === 200 || status === 201) {
      await setTokens(data.accessToken, data.refreshToken);
    }

    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
