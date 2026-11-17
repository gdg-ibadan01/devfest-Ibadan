import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// POST /api/email-campaigns/[id]/send
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, status } = await serverFetch(
      `/email-campaigns/${encodeURIComponent(id)}/send`,
      { method: 'POST' }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
