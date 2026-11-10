import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';
interface RouteContext {
  params: {
    discountId: string;
  };
}
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch(
      `/discounts/${encodeURIComponent(params.discountId)}`,
      { method: 'PATCH', body }
    );
    return apiResponse(data, status);
  } catch (error) {
    return handleRouteError(error);
  }
}