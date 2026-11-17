import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/orders/ticket-emails/summary  — counts of PAID orders by ticket-email state
export async function GET() {
  try {
    const { data, status } = await serverFetch('/orders/ticket-emails/summary');
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
