'use client';

import {
    QueryClient,
    QueryClientProvider,
    MutationCache,
    QueryCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReactQueryProviderProps {
    children: React.ReactNode;
}

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
                        retry: (failureCount, error: any) => {
                            // Don't retry on 4xx errors except 429 (rate limit)
                            if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
                                return false;
                            }
                            return failureCount < 3;
                        },
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: true,
                    },
                    mutations: {
                        retry: (failureCount, error: any) => {
                            // Don't retry mutations on 4xx errors
                            if (error?.status >= 400 && error?.status < 500) {
                                return false;
                            }
                            return failureCount < 2;
                        },
                    },
                },
                queryCache: new QueryCache({
                    onError: (error: any) => {
                        // Only show toast for unexpected errors (not 4xx client errors)
                        if (!error?.status || error.status >= 500) {
                            toast.error('An unexpected error occurred. Please try again.');
                        }
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error: any) => {
                        // Handle mutation errors globally if needed
                        console.error('Mutation error:', error);
                    },
                }),
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
