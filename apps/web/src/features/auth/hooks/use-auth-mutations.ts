'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../api/auth.service';
import {
    CreateUserRequest,
    LoginRequest,
    NewPasswordRequest,
    ResetPasswordRequest,
} from '../types';
import { authKeys } from './use-auth-queries';

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            const result = await signIn('credentials', {
                ...credentials,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            return result;
        },
        onSuccess: () => {
            toast.success('Login successful');
            router.push('/dashboard');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Login failed');
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await authService.logout();
            await signOut({ redirect: false });
        },
        onSuccess: () => {
            queryClient.clear();
            toast.success('Logged out successfully');
            router.push('/login');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Logout failed');
        },
    });
};

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: CreateUserRequest) => authService.register(data),
        onSuccess: () => {
            toast.success(
                'Registration successful! Please check your email to verify your account.',
            );
            router.push('/login');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Registration failed');
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
        onSuccess: () => {
            toast.success('Password reset email sent! Please check your inbox.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to send reset email');
        },
    });
};

export const useSetNewPassword = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: NewPasswordRequest) => authService.setNewPassword(data),
        onSuccess: () => {
            toast.success('Password updated successfully!');
            router.push('/login');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update password');
        },
    });
};

export const useRefreshToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (refreshToken: string) => authService.refreshAccessToken(refreshToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        },
    });
};
