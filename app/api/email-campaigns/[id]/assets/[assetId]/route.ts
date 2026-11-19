import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// DELETE /api/email-campaigns/[id]/assets/[assetId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const { id, assetId } = await params;
    const { data, status } = await serverFetch(
      `/email-campaigns/${encodeURIComponent(id)}/assets/${encodeURIComponent(assetId)}`,
      { method: 'DELETE' }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
