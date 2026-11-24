export interface AlatpayAd {
  /** Where the banner links to (opens in a new tab). */
  href: string;
  /** Alt text for the banner image(s); describe what the ad says. */
  alt: string;
  /** Desktop banner, 1280 x 320 px (4:1). File lives in /public, e.g. '/sponsors/ads/alatpay-desktop.png'. */
  desktopSrc?: string;
  /** Mobile banner, 800 x 800 px (1:1). */
  mobileSrc?: string;
  /** Optional one-line caption under the banner. */
  caption?: string;
  ctaLabel: string;
}

export const ALATPAY_AD_SIZES = {
  desktop: { width: 1280, height: 320 },
  mobile: { width: 800, height: 800 },
} as const;

/**
 * ALATPay's own ad slot. To go live: drop their images in /public/sponsors/ads/,
 * set desktopSrc and mobileSrc, and confirm href. Until then the section stays
 * hidden in production and shows a layout placeholder in development.
 */
export const ALATPAY_AD: AlatpayAd = {
  href: 'https://alatpay.ng',
  alt: 'ALATPay: Never miss a payment. Seamless integration, track transactions, instant payouts. Sign up on ALATPay.ng',
  desktopSrc: '/sponsors/ads/alatpay-desktop.jpeg',
  mobileSrc: undefined,
  caption: undefined,
  ctaLabel: 'Sign up on ALATPay',
};
