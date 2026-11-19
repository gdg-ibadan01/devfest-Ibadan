import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

// GET /api/payment-gateway — gateway for new orders + which gateways are configured
export async function GET() {
  try {
    const { data, status } = await serverFetch('/payment-gateway');
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

// PUT /api/payment-gateway — switch the gateway for new orders
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/payment-gateway', {
      method: 'PUT',
      body,
    });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
