import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// POST /api/email-campaigns/[id]/assets  (multipart: file + kind)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await req.formData();
    const { data, status } = await serverFetch(
      `/email-campaigns/${encodeURIComponent(id)}/assets`,
      { method: 'POST', body: form }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
