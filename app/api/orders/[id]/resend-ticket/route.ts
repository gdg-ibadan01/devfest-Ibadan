import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// POST /api/orders/[id]/resend-ticket  — re-send one attendee their ticket email
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, status } = await serverFetch(
      `/orders/${encodeURIComponent(id)}/resend-ticket`,
      { method: 'POST' }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
