import { NextRequest } from 'next/server';
import {
  serverFetch,
  apiResponse,
  handleRouteError,
} from '@/app/_module/lib/serverFetch';

type Ctx = { params: Promise<{ id: string }> };
const path = (id: string) => `/email-campaigns/${encodeURIComponent(id)}`;

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { data, status } = await serverFetch(path(id));
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { data, status } = await serverFetch(path(id), { method: 'PATCH', body });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { data, status } = await serverFetch(path(id), { method: 'DELETE' });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
