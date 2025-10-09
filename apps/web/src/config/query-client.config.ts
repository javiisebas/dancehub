import { QueryClient } from '@tanstack/react-query';

const defaultOptions = {
    queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: 'always' as const,
    },
    mutations: {
        retry: 0,
    },
};

export const queryClient = new QueryClient({
    defaultOptions,
});
