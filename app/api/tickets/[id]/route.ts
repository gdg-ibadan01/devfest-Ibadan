import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

type Ctx = { params: Promise<{ id: string }> };

// GET   /api/tickets/[id]
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { data, status } = await serverFetch(`/tickets/${id}`);
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

// PATCH /api/tickets/[id]
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { data, status } = await serverFetch(`/tickets/${id}`, { method: 'PATCH', body });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
