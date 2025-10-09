// Type-only imports para evitar runtime de @repo/shared
// ⚠️ IMPORTANTE: Solo types, nunca runtime imports en client

export type { CreateUserRequest } from '@repo/shared';

// ⚠️ LoginRequest no existe en @repo/shared, lo definimos localmente
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

export type { NewPasswordRequest, ResetPasswordRequest, SocialLoginRequest } from '@repo/shared';

export interface AuthUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}
