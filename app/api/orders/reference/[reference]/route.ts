import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/orders/reference/:reference — get order details by reference
export async function GET(
  _req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const { reference } = params;
    const { data, status } = await serverFetch(
      `/orders/reference/${reference}`
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
