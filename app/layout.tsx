import type { Metadata, Viewport } from 'next';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  ORGANIZER,
  SITE_NAME,
  SITE_URL,
} from './_module/config/seo';
import './globals.css';
import RootLayout from './layouts';
import { Toaster } from 'sonner';
import Script from 'next/script';
import MetaPixel from '@/components/MetaPixel';
import TikTokPixel from '@/components/TikTokPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { TIKTOK_PIXEL_ID } from '@/utils/tiktok-pixel';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: ORGANIZER.name, url: ORGANIZER.url }],
  creator: ORGANIZER.name,
  publisher: ORGANIZER.name,
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_NG',
    type: 'website',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4285f4',
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
        strategy="afterInteractive"
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
      <GoogleAnalytics />
      <Toaster position="top-center" />
      {children}
    </RootLayout>
  );
}
