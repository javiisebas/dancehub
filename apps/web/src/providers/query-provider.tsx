'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@web/config/query-client.config';
import { ReactNode } from 'react';

export interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
