import { NextRequest } from 'next/server';
import { serverFetch, apiResponse, handleRouteError } from '@/app/_module/lib/serverFetch';

// GET  /api/roles   — list roles
export async function GET(_req: NextRequest) {
  try {
    const { data, status } = await serverFetch('/roles');
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}

// POST /api/roles   — create role
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, status } = await serverFetch('/roles', { method: 'POST', body });
    return apiResponse(data, status);
  } catch (err) {
    return handleRouteError(err);
  }
}
