import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// POST /api/orders/resend-tickets  — re-send every ticket email not confirmed sent (batched)
export async function POST() {
  try {
    const { data, status } = await serverFetch('/orders/resend-tickets', {
      method: 'POST',
    });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
