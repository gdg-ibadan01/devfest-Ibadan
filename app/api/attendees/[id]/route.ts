import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET /api/attendees/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, status } = await serverFetch(`/attendees/${id}/retrieve`);
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
