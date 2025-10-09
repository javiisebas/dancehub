import { useQuery } from '@tanstack/react-query';
import { authService } from '../api/auth.service';

export const authKeys = {
    all: ['auth'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
    verifyEmail: (token: string) => [...authKeys.all, 'verify-email', token] as const,
};

export const useProfile = () => {
    return useQuery({
        queryKey: authKeys.profile(),
        queryFn: authService.getProfile,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

export const useVerifyEmail = (token: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: authKeys.verifyEmail(token),
        queryFn: () => authService.verifyEmail(token),
        enabled: enabled && !!token,
        retry: false,
        staleTime: Infinity,
    });
};
