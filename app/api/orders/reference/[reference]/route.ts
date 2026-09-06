import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET /api/orders/reference/[reference]   — look up an order by its payment reference
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const { data, status } = await serverFetch(
      `/orders/reference/${encodeURIComponent(reference)}`
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
