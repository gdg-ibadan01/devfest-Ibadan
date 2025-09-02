import {
  adminLoginData,
  AdminLoginResponse,
  ApiError,
  CreateAttendeeRequest,
  CreateAttendeeResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
} from '@/types/services';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Admin endpoints that require authentication
const ADMIN_ENDPOINTS = ['/admin'];

// Check if endpoint requires authentication
const requiresAuth = (url: string): boolean => {
  return ADMIN_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

// Custom Axios instance
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Only add auth token for admin endpoints
        if (config.url && requiresAuth(config.url)) {
          const token =
            typeof window !== 'undefined'
              ? localStorage.getItem('authToken')
              : null;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(this.formatError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): ApiError {
    // Handle network errors
    if (!error.response) {
      return {
        statusCode: 0,
        success: false,
        message:
          error.code === 'ECONNABORTED'
            ? 'Request timeout. Please check your internet connection and try again.'
            : error.code === 'ERR_NETWORK'
              ? 'Network error occurred'
              : error.message || 'Network error occurred',
      };
    }

    // Handle HTTP errors
    const apiError: ApiError = {
      statusCode: error.response.status,
      success: false,
      message:
        error.response.data?.message ||
        this.getDefaultErrorMessage(error.response.status),
      errors: error.response.data?.errors,
    };

    // Handle specific error codes for admin endpoints
    if (
      error.response.status === 401 &&
      requiresAuth(error.config?.url || '')
    ) {
      // Handle unauthorized for admin endpoints only
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // You can add redirect logic here if needed
        // window.location.href = '/admin/login';
      }
      apiError.message = 'Session expired. Please login again.';
    }

    return apiError;
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This resource already exists.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Service temporarily unavailable. Please try again later.';
      case 503:
        return 'Service under maintenance. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  }
  // Generic request methods
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = unknown, R = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    return this.client.post<R>(url, data, config);
  }

  async put<T = unknown, R = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    return this.client.put<R>(url, data, config);
  }

  async patch<T = unknown, R = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    return this.client.patch<R>(url, data, config);
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Specific API methods
  async createAttendee(
    data: CreateAttendeeRequest
  ): Promise<CreateAttendeeResponse> {
    const response = await this.post<
      CreateAttendeeRequest,
      CreateAttendeeResponse
    >('attendees', data);
    return response.data;
  }

  async initiatePayment(
    data: InitiatePaymentRequest
  ): Promise<InitiatePaymentResponse> {
    const response = await this.post<
      InitiatePaymentRequest,
      InitiatePaymentResponse
    >('payments/initialize', data);
    return response.data;
  }

  // Auth methods
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AdminLoginResponse> {
    const response = await this.post<adminLoginData, AdminLoginResponse>(
      'admin/auth/login',
      credentials
    );

    // Store token after successful login
    if (response.data.success && typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.data.accessToken);
    }

    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export default axios instance if needed for other use cases
export { axios };
export default apiClient;
