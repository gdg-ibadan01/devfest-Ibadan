import axios, { AxiosError } from 'axios';
import { showToast } from '@/app/_module/lib/notify';

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
