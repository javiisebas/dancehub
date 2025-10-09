import { apiClient } from '@web/api';
import {
    CreateUserRequest,
    LoginRequest,
    LoginResponse,
    NewPasswordRequest,
    PasswordResponse,
    ResetPasswordRequest,
    SocialLoginRequest,
} from '../types';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse, LoginRequest>('/auth/local/login', credentials, false);
    },

    logout: async (): Promise<void> => {
        return apiClient.delete<void>('/auth/logout');
    },

    register: async (data: CreateUserRequest): Promise<void> => {
        return apiClient.post<void, CreateUserRequest>('/auth/local/register', data, false);
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<PasswordResponse> => {
        return apiClient.post<PasswordResponse, ResetPasswordRequest>(
            '/auth/password/reset',
            data,
            false,
        );
    },

    setNewPassword: async (data: NewPasswordRequest): Promise<PasswordResponse> => {
        return apiClient.patch<PasswordResponse, NewPasswordRequest>('/auth/password/new', data);
    },

    getProfile: async () => {
        return apiClient.get('/auth/me');
    },

    refreshAccessToken: async (refreshToken: string): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse, { refreshToken: string }>(
            '/auth/refresh',
            { refreshToken },
            false,
        );
    },

    socialLogin: async (payload: SocialLoginRequest): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse, SocialLoginRequest>('/auth/social/login', payload);
    },

    verifyEmail: async (token: string): Promise<PasswordResponse> => {
        return apiClient.get<PasswordResponse>(`/auth/verify-email?token=${token}`, false);
    },
};
