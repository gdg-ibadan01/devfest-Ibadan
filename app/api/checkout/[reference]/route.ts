import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/checkout/[reference] — inline checkout for an unpaid order
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const { data, status } = await serverFetch(
      `/checkout/${encodeURIComponent(reference)}`
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
