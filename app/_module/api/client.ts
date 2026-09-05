import axios, { AxiosError } from 'axios';
import { showToast } from '@/app/_module/lib/notify';

// The browser always talks to our own Next.js API routes (app/api/**),
// never the external backend directly. Those routes run server-side, read
// the httpOnly admin_access_token/admin_refresh_token cookies (via
// serverFetch.ts), attach the Authorization header, and transparently
// refresh expired tokens — none of which the browser can (or should) do on
// its own. This is intentionally a fixed relative path: it needs no env var
// at all, since only server-side code (serverFetch.ts) ever talks to the
// real API and reads `API_BASE_URL` directly (no NEXT_PUBLIC_ prefix
// required — that prefix is only needed for values read from the browser
// bundle, which this is not).
const API_PROXY_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_PROXY_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred';

    // Centralized RBAC handling: surface a single, consistent toast whenever
    // the backend rejects a request for lack of permission, regardless of
    // whether the call site is a query or a mutation. `handled: true` lets
    // per-call `onError` handlers (see notifyApiError) avoid double-toasting.
    let handled = false;
    if (status === 403) {
      showToast.error("You don't have permission to perform this action.");
      handled = true;
    }

    const apiError = Object.assign(new Error(message), {
      status,
      data: error.response?.data,
      handled,
    });

    return Promise.reject(apiError);
  }
);
