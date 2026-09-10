import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

type Ctx = { params: Promise<{ discountCode: string }> | { discountCode: string } };

// GET /api/v1/discounts/code/[discountCode]
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { discountCode } = resolvedParams;
    const { data, status } = await serverFetch(
      `/discounts/code/${encodeURIComponent(discountCode)}`,
      { req }
    );
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
