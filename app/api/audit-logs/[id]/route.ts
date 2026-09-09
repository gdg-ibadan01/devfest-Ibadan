import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, status } = await serverFetch(`/audit-logs/${encodeURIComponent(params.id)}`);
    return apiResponse(data, status);
  } catch (error) {
    return handleRouteError(error);
  }
}
