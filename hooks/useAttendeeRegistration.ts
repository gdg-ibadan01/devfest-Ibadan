import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/services/.';
import {
  ApiError,
  CreateAttendeeRequest,
  CreateAttendeeResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
} from '@/types/services';

// Hook options types
interface MutationConfig<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

// Create Attendee Mutation
export function useCreateAttendee(
  options?: MutationConfig<
    CreateAttendeeResponse,
    ApiError,
    CreateAttendeeRequest
  >
): UseMutationResult<CreateAttendeeResponse, ApiError, CreateAttendeeRequest> {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Attendee created successfully!',
    errorMessage,
    ...mutationOptions
  } = options || {};

  return useMutation({
    mutationFn: (data: CreateAttendeeRequest) => apiClient.createAttendee(data),
    onSuccess: (data, variables, context) => {
      if (showSuccessToast) {
        toast.success(successMessage);
      }
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

// Initiate Payment Mutation
export function useInitiatePayment(
  options?: MutationConfig<
    InitiatePaymentResponse,
    ApiError,
    InitiatePaymentRequest
  >
): UseMutationResult<
  InitiatePaymentResponse,
  ApiError,
  InitiatePaymentRequest
> {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Payment initialized successfully!',
    errorMessage,
    ...mutationOptions
  } = options || {};

  return useMutation({
    mutationFn: (data: InitiatePaymentRequest) =>
      apiClient.initiatePayment(data),
    onSuccess: (data, variables, context) => {
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (showErrorToast) {
        const message =
          errorMessage || error.message || 'Failed to initialize payment';
        toast.error(message);
      }
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}

// Combined hook for attendee registration flow
export function useAttendeeRegistration() {
  const createAttendee = useCreateAttendee({
    showSuccessToast: false, // We'll handle success manually
    showErrorToast: true,
  });

  const initiatePayment = useInitiatePayment({
    showSuccessToast: false, // We'll handle success manually
    showErrorToast: true,
  });

  const registerAttendeeWithPayment = async (
    attendeeData: CreateAttendeeRequest,
    paymentAmount: number
  ) => {
    try {
      // First create the attendee
      const attendeeResponse = await createAttendee.mutateAsync(attendeeData);
      toast.success('Attendee profile created successfully!');

      // Then initiate payment
      const paymentResponse = await initiatePayment.mutateAsync({
        attendeeId: attendeeResponse.data.id,
        email: attendeeData.email,
        amount: paymentAmount,
      });

      toast.loading('Redirecting to payment...');

      // Redirect to payment URL
      if (typeof window !== 'undefined') {
        window.location.href = paymentResponse.data.authorization_url;
      }

      return {
        attendee: attendeeResponse,
        payment: paymentResponse,
      };
    } catch (error) {
      console.error('Registration flow failed:', error);
      throw error;
    }
  };

  return {
    createAttendee,
    initiatePayment,
    registerAttendeeWithPayment,
    isLoading: createAttendee.isPending || initiatePayment.isPending,
    isError: createAttendee.isError || initiatePayment.isError,
    error: createAttendee.error || initiatePayment.error,
  };
}
