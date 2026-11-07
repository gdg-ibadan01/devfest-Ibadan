import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/_module/config/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Admin and API are never meant to be crawled. Pages that should stay out of
      // search results but must remain crawlable (so the noindex header is seen) are
      // handled by X-Robots-Tag headers in next.config.mjs instead.
      disallow: ['/core', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
