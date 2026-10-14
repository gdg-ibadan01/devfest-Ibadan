import type { Metadata } from 'next';
import './globals.css';
import RootLayout from './layouts';
import { Toaster } from 'sonner';
import Script from 'next/script';
import MetaPixel from '@/components/MetaPixel';
import TikTokPixel from '@/components/TikTokPixel';
import { TIKTOK_PIXEL_ID } from '@/utils/tiktok-pixel';

export const metadata: Metadata = {
  title: 'Devfest Ibadan 2026',
  description:
    'Join DevFest Ibadan 2026 on 21 November at Kakanfo Inn & Conference Centre for talks, workshops, codelabs and networking.',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tiktokPixelId = TIKTOK_PIXEL_ID || 'DB73SMBC77U3SVPIJMP0';

  return (
    <RootLayout>
      <Script
        id="tiktok-pixel-base"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('${tiktokPixelId}');
  ttq.page();
}(window, document, 'ttq');
          `,
        }}
      />
      <MetaPixel />
      <TikTokPixel />
      <Toaster position="top-center" />
      {children}
    </RootLayout>
  );
}
