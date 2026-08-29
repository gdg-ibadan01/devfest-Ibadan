import axios, { AxiosError } from 'axios';

// All requests go through our own Next.js API routes — the real API
// URL never leaves the server and never appears in the browser network tab.
export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// ---- Response interceptor — normalise errors ----------------
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred';

    const apiError = Object.assign(new Error(message), {
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(apiError);
  }
);
