import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// POST /api/email-campaigns/[id]/test
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { data, status } = await serverFetch(
      `/email-campaigns/${encodeURIComponent(id)}/test`,
      { method: 'POST', body }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
