'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/_module/api/client';
import { queryKeys } from '@/app/_module/api/queryKeys';
import { showToast } from '@/app/_module/lib/notify';
import type { FindOneAdminResponseDto } from '@/app/_module/api/types';
import { PageLoader } from '@/app/layouts';

async function fetchMe(): Promise<FindOneAdminResponseDto> {
  const { data } = await apiClient.get<FindOneAdminResponseDto>('/admin/me');
  return data;
}

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const toastShown = useRef(false);

  const { isLoading, isError, error } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  useEffect(() => {
    if (isError && !toastShown.current) {
      const status = (error as { status?: number })?.status;
      toastShown.current = true;

      if (status === 401) {
        showToast.error('Your session has expired. Please sign in again.');
      } else {
        showToast.error('Unable to verify authentication. Please sign in.');
      }

      router.replace('/admin');
    }
  }, [isError, error, router]);

  if (isLoading) return <PageLoader />;
  if (isError) return null;

  return <>{children}</>;
}
