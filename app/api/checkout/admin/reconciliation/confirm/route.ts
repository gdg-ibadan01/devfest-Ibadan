import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// POST /api/checkout/admin/reconciliation/confirm — admin: confirm a reconciled ALATPay transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch(
      '/checkout/admin/reconciliation/confirm',
      {
        method: 'POST',
        body,
      }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
