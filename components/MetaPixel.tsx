'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

const trackedPurchases = new Set<string>();

export const fbqTrack = (
  event: string,
  options?: Record<string, unknown>,
  extraConfig?: Record<string, unknown>
) => {
  if (typeof window === 'undefined') return;

  if (typeof window.fbq !== 'function') {
    const n: any =
      window.fbq ??
      function (...args: unknown[]) {
        n.callMethod ? n.callMethod(...args) : n.queue.push(args);
      };
    if (!n.queue) n.queue = [];
    window.fbq = n;
  }

  if (extraConfig && options) {
    window.fbq?.('track', event, options, extraConfig);
  } else if (options) {
    window.fbq?.('track', event, options);
  } else {
    window.fbq?.('track', event);
  }
};

export const trackPurchase = (price: number, orderIdOrRef?: string | null) => {
  if (typeof window === 'undefined') return;

  const cleanRef = orderIdOrRef?.trim();
  const key = cleanRef ? `fb_purchase_${cleanRef}` : null;

  if (key) {
    if (trackedPurchases.has(key)) {
      return; // Already tracked in memory
    }
    if (window.sessionStorage !== undefined) {
      if (sessionStorage.getItem(key)) {
        return; // Already tracked in session
      }
      sessionStorage.setItem(key, 'true');
    }
    trackedPurchases.add(key);
  }

  const value = Number(Number(price).toFixed(2)) || 0;
  const options = { value, currency: 'NGN' };

  if (cleanRef) {
    fbqTrack('Purchase', options, { eventID: cleanRef });
  } else {
    fbqTrack('Purchase', options);
  }
};

function MetaPixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Prevent duplicate pageview tracking on the initial mount,
    // since fbq('track', 'PageView') is already triggered by the initialization script.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <MetaPixelTracker />
      </Suspense>
    </>
  );
}
