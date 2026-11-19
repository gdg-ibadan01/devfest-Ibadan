/** @type {import('next').NextConfig} */

// Pages that must stay out of search results but remain crawlable so the header is seen.
const NOINDEX_PATHS = [
  '/core/:path*',
  '/tickets/success',
  '/tickets/preview',
  '/tickets/pay/:path*',
  '/forgot-password',
  '/reset-password',
  '/password-changed',
];

const nextConfig = {
  images: {
    domains: ['sessionize.com'],
  },
  async headers() {
    return NOINDEX_PATHS.map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  },
};

export default nextConfig;
