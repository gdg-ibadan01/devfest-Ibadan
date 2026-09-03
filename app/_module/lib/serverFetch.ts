import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL ?? 'https://devfest-ibadan.onrender.com/api/v1';

/** Build auth headers using the current access token from httpOnly cookie */
async function buildHeaders(token?: string): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = token ?? cookieStore.get('admin_access_token')?.value;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  return headers;
}

/** Attempt to refresh the access token using the refresh token cookie */
async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('admin_refresh_token')?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/admin/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json() as { accessToken: string; refreshToken: string };

    // Persist the new tokens into the httpOnly cookies
    // We import dynamically to avoid circular deps — server action is already defined
    const { setTokens } = await import('@/app/actions/auth');
    await setTokens(data.accessToken, data.refreshToken);

    return data.accessToken;
  } catch {
    return null;
  }
}

/** Generic server-to-server request to the real API with automatic token refresh on 401 */
export async function serverFetch<T = unknown>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    req?: NextRequest; // pass to forward query params
  } = {}
): Promise<{ data: T; status: number }> {
  const url = new URL(`${API_BASE}${path}`);

  // Forward query params from options.params
  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  // Forward query params from the incoming Next.js request
  if (options.req) {
    options.req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
  }

  const doRequest = async (tokenOverride?: string) => {
    const headers = await buildHeaders(tokenOverride);
    return fetch(url.toString(), {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });
  };

  let res = await doRequest();

  // On 401, attempt a token refresh and retry once
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doRequest(newToken);
    }
  }

  const text = await res.text();
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    data = text as unknown as T;
  }

  return { data, status: res.status };
}

/** Build a standardised Next.js response from a serverFetch result */
export function apiResponse(data: unknown, status: number) {
  return NextResponse.json(data, { status });
}

/** Handle errors consistently in route handlers */
export function handleRouteError(err: unknown) {
  console.error('[API route error]', err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  return NextResponse.json({ message }, { status: 500 });
}
