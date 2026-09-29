'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from './lenis';

export interface SmoothScrollOptions {
  /** Offset in pixels from the target element (default: -20) */
  offset?: number;
  /** Duration of the scroll animation in seconds (default: 1.2) */
  duration?: number;
  /** Whether to update the browser URL hash (default: true) */
  updateHash?: boolean;
}

/**
 * Programmatically scrolls to a target element smoothly using Lenis if available,
 * with a fallback to native element.scrollIntoView().
 */
export function smoothScrollTo(
  target: string | HTMLElement,
  options?: SmoothScrollOptions,
  lenisInstance?: ReturnType<typeof useLenis>
) {
  if (typeof window === 'undefined') return;

  const { offset = -20, duration = 1.2, updateHash = true } = options || {};

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset, duration });
  } else {
    const el =
      typeof target === 'string'
        ? target.startsWith('#')
          ? document.getElementById(target.slice(1))
          : document.querySelector(target)
        : target;

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (updateHash && typeof target === 'string' && (target.startsWith('#') || target.startsWith('/#'))) {
    const hash = target.startsWith('/#') ? target.slice(1) : target;
    window.history.pushState(null, '', hash);
  }
}

/**
 * Reusable React hook for smooth scrolling.
 * Works seamlessly with Lenis across sections, navbar, and footer.
 */
export function useSmoothScroll() {
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();

  const scrollTo = useCallback(
    (target: string | HTMLElement, options?: SmoothScrollOptions) => {
      // If target is an anchor hash (e.g. "#tickets" or "/#tickets")
      if (typeof target === 'string' && (target.startsWith('#') || target.startsWith('/#'))) {
        const hash = target.startsWith('/#') ? target.slice(1) : target;

        // If we are on a different page, navigate to home with the hash
        if (pathname && pathname !== '/') {
          router.push(`/${hash}`);
          return;
        }

        smoothScrollTo(hash, options, lenis);
        return;
      }

      smoothScrollTo(target, options, lenis);
    },
    [lenis, pathname, router]
  );

  /**
   * Helper that creates an onClick handler for links and buttons.
   * Prevents instant jump, smoothly scrolls, and runs optional callback (e.g. close mobile menu).
   */
  const handleScrollTo = useCallback(
    <T extends HTMLElement = HTMLElement>(
      target: string | HTMLElement,
      options?: SmoothScrollOptions,
      onAfterClick?: (e: React.MouseEvent<T>) => void
    ) => {
      return (e: React.MouseEvent<T>) => {
        const isHash =
          typeof target === 'string' && (target.startsWith('#') || target.startsWith('/#'));
        const isCurrentPage = !pathname || pathname === '/';

        if (isHash && isCurrentPage) {
          e.preventDefault();
          scrollTo(target, options);
        } else if (isHash && !isCurrentPage) {
          e.preventDefault();
          const cleanHash = target.startsWith('/#') ? target.slice(1) : target;
          router.push(`/${cleanHash}`);
        } else {
          e.preventDefault();
          scrollTo(target, options);
        }

        onAfterClick?.(e);
      };
    },
    [scrollTo, pathname, router]
  );

  return {
    scrollTo,
    handleScrollTo,
    lenis,
  };
}
