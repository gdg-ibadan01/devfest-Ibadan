import type { Metadata } from 'next';

export const SITE_URL = 'https://devfestibadan.com';
export const SITE_NAME = 'DevFest Ibadan 2026';
export const DEFAULT_TITLE =
  'DevFest Ibadan 2026 | 21 Nov Tech Conference in Ibadan';
export const DEFAULT_DESCRIPTION =
  'Join DevFest Ibadan 2026 on 21 November at Kakanfo Inn & Conference Centre, Ring Road, Ibadan: talks, workshops, codelabs and networking by GDG Ibadan.';

/** Real size of the hosted image. Swap for a 1200x630 version when one exists. */
export const OG_IMAGE = {
  url: 'https://res.cloudinary.com/dh8trnu8w/image/upload/v1789055800/email-image_zgldak.png',
  width: 1200,
  height: 400,
  alt: 'DevFest Ibadan 2026, 21 November at Kakanfo Inn & Conference Centre, Ibadan',
};

export const ORGANIZER = {
  name: 'GDG Ibadan',
  url: 'https://gdg.community.dev/gdg-ibadan/',
  sameAs: [
    'https://gdg.community.dev/gdg-ibadan/',
    'https://www.linkedin.com/company/gdg-ibadan',
    'https://x.com/gdgibadan',
    'https://www.instagram.com/gdgibadan',
  ],
};

interface PageMetadataInput {
  /** Page title. The root title template appends the site name. */
  title: string;
  description: string;
  /** Path starting with "/", used for the canonical URL. */
  path: string;
}

/**
 * Per-page metadata with a canonical URL and matching Open Graph / Twitter tags.
 * (A page's `openGraph` replaces the layout's, so each page must repeat the image.)
 */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_NG',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
