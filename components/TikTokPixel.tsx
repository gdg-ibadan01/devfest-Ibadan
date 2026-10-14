'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { TIKTOK_PIXEL_ID, flushTikTokPixelEvents } from '@/utils/tiktok-pixel';

function TikTokPixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    flushTikTokPixelEvents();

    // Prevent duplicate pageview tracking on the initial mount,
    // since ttq.page() is already triggered by the head initialization script.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.ttq &&
      typeof window.ttq.page === 'function'
    ) {
      window.ttq.page();
    }
  }, [pathname, searchParams]);

  return null;
}

export default function TikTokPixel() {
  if (!TIKTOK_PIXEL_ID) return null;

  return (
    <Suspense fallback={null}>
      <TikTokPixelTracker />
    </Suspense>
  );
}
