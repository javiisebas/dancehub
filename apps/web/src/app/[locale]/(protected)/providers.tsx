'use client';

import { SidebarProvider } from '@repo/ui/components';
import { AuthProvider } from '@web/providers';
import { ReactNode } from 'react';

export interface ProtectedProvidersProps {
    children: ReactNode;
}

export function ProtectedProviders({ children }: ProtectedProvidersProps) {
    return (
        <AuthProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
    );
}
