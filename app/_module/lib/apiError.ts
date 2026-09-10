import { showToast } from './notify';

/**
 * Shape of the normalized error object thrown by the `apiClient` response
 * interceptor (see `app/_module/api/client.ts`).
 */
export interface ApiError extends Error {
  status?: number;
  data?: unknown;
  /** Set by the interceptor when it has already surfaced a toast for this error. */
  handled?: boolean;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error;
}

export function getErrorStatus(error: unknown): number | undefined {
  return isApiError(error) ? error.status : undefined;
}

/**
 * Shows an error toast for a failed mutation/query, unless the response
 * interceptor already surfaced a toast for it (currently: 403 Forbidden,
 * which gets a dedicated "no access" message globally). Use this instead of
 * calling `showToast.error` directly inside `onError` handlers to avoid
 * double toasts on permission errors.
 */
export function notifyApiError(error: unknown, fallback: string) {
  if (isApiError(error) && error.handled) return;
  const message = isApiError(error) ? error.message : undefined;
  showToast.error(message || fallback);
}
