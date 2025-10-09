/**
 * 🔐 USE AUTH HOOK
 *
 * Hook para acceder a información de autenticación
 * - Session data
 * - User info
 * - Loading states
 */

'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
    const { data: session, status } = useSession();

    return {
        user: session?.user,
        isAuthenticated: !!session,
        isLoading: status === 'loading',
        session,
    };
}

/**
 * Hook para verificar roles
 */
export function useHasRole(role: string) {
    const { user } = useAuth();
    const roles = (user as any)?.roles || [];
    return roles.includes(role);
}

/**
 * Hook para verificar si es admin
 */
export function useIsAdmin() {
    return useHasRole('admin');
}
