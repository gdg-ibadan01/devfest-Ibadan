import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a fresh QueryClient for a single server render. A new instance is
 * required per request (never a module-level singleton) so cached data from
 * one user's request can never leak into another's — see the official
 * TanStack Query Next.js App Router SSR guidance.
 *
 * Options mirror `providers/react-query.tsx` (the client-side provider) so
 * data hydrated from the server is treated identically once picked up by the
 * client — e.g. it won't be considered stale/refetched immediately.
 */
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
      },
    },
  });
}
