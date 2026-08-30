import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// Response interceptor
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
