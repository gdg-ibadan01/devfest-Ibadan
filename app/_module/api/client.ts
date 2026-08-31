import axios, { AxiosError } from 'axios';

const getBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://devfest-ibadan.onrender.com/api/v1';

  return url.endsWith('/api/v1') ? url : `${url.replace(/\/+$/, '')}/api/v1`;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
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
