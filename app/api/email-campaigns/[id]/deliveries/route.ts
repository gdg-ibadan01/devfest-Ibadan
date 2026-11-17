import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, status } = await serverFetch(
      `/email-campaigns/${encodeURIComponent(id)}/deliveries`,
      { req }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
