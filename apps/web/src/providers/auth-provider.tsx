'use client';

import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export interface AuthProviderProps {
    children: ReactNode;
}

function SessionErrorHandler({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.error === 'RefreshAccessTokenError') {
            console.error('🔴 Session expired. Redirecting to login...');
            signOut({ callbackUrl: '/login?error=SessionExpired' });
        }
    }, [session, status, router]);

    return <>{children}</>;
}

export function AuthProvider({ children }: AuthProviderProps) {
    return (
        <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>
            <SessionErrorHandler>{children}</SessionErrorHandler>
        </SessionProvider>
    );
}
