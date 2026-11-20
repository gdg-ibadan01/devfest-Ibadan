'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { showToast } from '@/app/_module/lib/notify';
import type {
  FindOneAdminResponseDto,
  PermissionId,
} from '@/app/_module/api/types';
import { PageLoader } from '@/app/layouts';
import { navItemForPath } from '@/app/_module/config/adminNav';
import {
  firstAllowedPath,
  hasAnyPermission,
} from '@/app/_module/lib/permissions';
import { useAdminLogout } from '@/app/_module/services';

async function fetchMe(): Promise<FindOneAdminResponseDto> {
  const { data } = await apiClient.get<FindOneAdminResponseDto>('/admin/me');
  return data;
}

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const toastShown = useRef(false);
  const { mutate: logout, isPending: loggingOut } = useAdminLogout();

  const {
    data: me,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const permissions = (me?.role?.permissions ?? []) as PermissionId[];
  const routeItem = navItemForPath(pathname);
  const allowedHere =
    !routeItem || hasAnyPermission(permissions, routeItem.permissions);
  const fallbackPath = me ? firstAllowedPath(permissions) : null;

  // Only a 401 means "not signed in". Anything else (network blip, 5xx) is
  // not a reason to throw the admin out mid-event.
  useEffect(() => {
    if (isError && !toastShown.current) {
      const status = (error as { status?: number })?.status;
      toastShown.current = true;

      if (status === 401) {
        showToast.error('Your session has expired. Please sign in again.');
      } else {
        showToast.error('Unable to verify authentication. Please sign in.');
      }

      router.replace('/core');
    }
  }, [isError, error, router]);

  // Signed in but this module isn't in the role — send them to the first
  // module they can open (e.g. check-in-only staff land on Checkins).
  useEffect(() => {
    if (me && !allowedHere && fallbackPath && fallbackPath !== pathname) {
      router.replace(fallbackPath);
    }
  }, [me, allowedHere, fallbackPath, pathname, router]);

  if (isLoading) return <PageLoader />;
  if (isError) return null;

  if (me && !allowedHere) {
    if (fallbackPath) return <PageLoader />;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <h2 className="text-[18px] font-bold text-[#1e1e1e]">No access yet</h2>
        <p className="max-w-[420px] text-[13px] text-gray-500">
          Your role ({me.role?.name}) has no dashboard permissions. Ask a super
          admin to assign one, then sign in again.
        </p>
        <button
          type="button"
          onClick={() => logout()}
          disabled={loggingOut}
          className="mt-2 rounded-md bg-[#1e1e1e] px-5 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
        >
          {loggingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
