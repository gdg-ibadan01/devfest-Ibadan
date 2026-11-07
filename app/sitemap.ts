import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/_module/config/seo';

// Only indexable, content-bearing pages. Placeholder ("coming soon") routes,
// the gift redirect and transactional pages are left out on purpose.
const PATHS = ['/', '/tickets/buy', '/organizers', '/flyer'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
  }));
}
