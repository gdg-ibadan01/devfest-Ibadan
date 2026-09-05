import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/_module/api/client';
import { showToast } from '@/app/_module/lib/notify';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { clearTokens } from '@/app/actions/auth';
import type {
  LoginAdminDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '@/app/_module/api/types';

// ---- Login -------------------------------------------------
// Token cookies are set server-side inside /api/admin/login/route.ts

async function loginAdmin(dto: LoginAdminDto): Promise<void> {
  await apiClient.post('/admin/login', dto);
}

export function useAdminLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: () => {
      showToast.success('Successful sign in');
      router.replace('/admin/home');
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Incorrect email or password');
    },
  });
}

// ---- Logout ------------------------------------------------

export function useAdminLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await clearTokens();
    },
    onSuccess: () => {
      showToast.success('Signed out successfully');
      router.replace('/admin');
    },
  });
}

// ---- Forgot password ----------------------------------------

async function forgotPassword(dto: ForgotPasswordDto): Promise<void> {
  await apiClient.post('/admin/forgot-password', dto);
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      showToast.success('Reset link sent — check your email');
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Failed to send reset link');
    },
  });
}

// ---- Reset password -----------------------------------------

async function resetPassword(dto: ResetPasswordDto): Promise<void> {
  await apiClient.post('/admin/reset-password', dto);
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      showToast.success('Password reset successfully');
      router.replace('/password-changed');
    },
    onError: (error: Error) => {
      notifyApiError(error, 'Password reset failed');
    },
  });
}
