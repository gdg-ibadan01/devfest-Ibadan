import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

export async function GET() {
  try {
    const { data, status } = await serverFetch('/audit-logs/actions');
    return apiResponse(data, status);
  } catch (error) {
    return handleRouteError(error);
  }
}
