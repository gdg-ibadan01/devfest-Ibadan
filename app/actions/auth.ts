'use server';

import { cookies } from 'next/headers';

const ACCESS_TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function setTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  // No explicit maxAge — cookies persist for the session; expiry is enforced server-side via JWT
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    ...COOKIE_OPTIONS,
  });
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // refresh token kept 7 days
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
}

export async function clearTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}
