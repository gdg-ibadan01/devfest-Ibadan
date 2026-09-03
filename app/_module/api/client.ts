import axios, { AxiosError } from 'axios';
import { showToast } from '@/app/_module/lib/notify';

export const apiClient = axios.create({
  baseURL: '/api',
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
