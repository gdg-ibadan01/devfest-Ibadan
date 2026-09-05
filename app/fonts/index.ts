import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const google_sans = localFont({
  src: [
    {
      path: './GoogleSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './GoogleSans-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './GoogleSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './GoogleSans-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './GoogleSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './GoogleSans-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-google-sans',
  display: 'swap',
});

export const grotesk = localFont({
  src: [
    {
      path: './FKGroteskNeueTrial-Thin-BF6576818c2a14c.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './FKGroteskNeueTrial-ThinItalic-BF6576818c5cbd8.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './FKGroteskNeueTrial-Light-BF6576818c0f3e8.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './FKGroteskNeueTrial-LightItalic-BF6576818c3183c.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './FKGroteskNeueTrial-Regular-BF6576818c3af74.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './FKGroteskNeueTrial-Italic-BF6576818c041e2.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './FKGroteskNeueTrial-Medium-BF6576818c3a00a.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './FKGroteskNeueTrial-MediumItalic-BF6576818c2aaf8.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './FKGroteskNeueTrial-Bold-BF6576818bd3700.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './FKGroteskNeueTrial-BoldItalic-BF6576818c39d11.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './FKGroteskNeueTrial-Black-BF6576818b4c472.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './FKGroteskNeueTrial-BlackItalic-BF6576818becb0d.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-grotesk',
  display: 'swap',
});

export const caleit = localFont({
  src: [
    {
      path: './caleit-bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-caleit',
  display: 'swap',
});
