import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { apiClient } from '@/services';
import { useRouter } from 'next/navigation';
import {
  AdminCreateAttendeeResponse,
  AdminLoginResponse,
  ApiError,
  CreateAttendeeRequest,
  CreateAttendeeResponse,
  GetPaymentsParams,
  GetPaymentsResponse,
} from '@/types/services';
import { toast } from 'sonner';
import { MutationConfig } from './useAttendeeRegistration';

export const useAdminAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiClient.login(credentials);
    },
    onSuccess: (data: AdminLoginResponse) => {
      if (data.success) {
        // Invalidate relevant queries if needed
        queryClient.invalidateQueries({ queryKey: ['admin'] });
        toast.success('Login successful');
        router.push('/admin/payments');
      } else {
        toast.error(data.message || 'Login failed');
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'An error occurred while logging in');
    },
  });

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      queryClient.clear(); // Clear all queries
      router.push('/admin');
    }
  };

  return {
    login: loginMutation,
    logout,
    isAuthenticated: apiClient.isAuthenticated(),
  };
};

export function useGetAllPayments(
  filters: GetPaymentsParams = {},
  options?: Omit<
    UseQueryOptions<GetPaymentsResponse, ApiError>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GetPaymentsResponse, ApiError> {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => apiClient.getAllPayments(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}
export const useCheckInAttendee = (options?: {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: unknown, variables: string, context: unknown) => void;
  onError?: (error: unknown, variables: string, context: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    ...mutationOptions
  } = options || {};

  return useMutation({
    mutationFn: async (ticketNumber: string) => {
      const response = await apiClient.checkInAttendee(ticketNumber);
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      return response;
    },
    onSuccess: (data, variables, context) => {
      if (showSuccessToast) {
        const message =
          successMessage || data.message || 'Attendee checked in successfully!';
        toast.success(message);
      }

      // Call custom onSuccess if provided
      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      if (showErrorToast) {
        const message =
          errorMessage ||
          error?.response?.data?.message ||
          'Failed to check in attendee';
        toast.error(message);
      }

      // Call custom onError if provided
      onError?.(error, variables, context);
    },
  });
};

export function useCreateAttendeeByAdmin(
  options?: MutationConfig<
    AdminCreateAttendeeResponse,
    ApiError,
    CreateAttendeeRequest
  >
): UseMutationResult<
  AdminCreateAttendeeResponse,
  ApiError,
  CreateAttendeeRequest
> {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Attendee has been successfully checked-in!',
    errorMessage,
    ...mutationOptions
  } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttendeeRequest) =>
      apiClient.createAttendeeByAdmin(data),
    onSuccess: (data, variables, context) => {
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      queryClient.invalidateQueries({ queryKey: ['payments', 'attendees'] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (showErrorToast) {
        const message =
          errorMessage || error.message || 'Failed to create attendee';
        toast.error(message);
      }
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}
