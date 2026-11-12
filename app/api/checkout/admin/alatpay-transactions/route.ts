import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/checkout/admin/alatpay-transactions?hours=3 — admin: recent ALATPay transactions
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch(
      '/checkout/admin/alatpay-transactions',
      { req }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
