import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/checkout/admin/reconciliation?hours=6 — paid on ALATPay, not PAID here
export async function GET(req: NextRequest) {
  try {
    const { data, status } = await serverFetch(
      '/checkout/admin/reconciliation',
      { req }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
