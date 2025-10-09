/**
 * 🔐 NEXTAUTH CONFIGURATION
 *
 * Configuración profesional de NextAuth con:
 * - Credentials provider (email/password)
 * - Google OAuth (si está configurado)
 * - JWT strategy
 * - Session management
 * - Error handling
 */

// ⚠️ NO importar runtime de @repo/shared en API routes (causa Reflect.getMetadata error)
// import { TIME_MS } from '@repo/shared';

import { env, oauth } from '@web/config/env.config';
import { authService } from '@web/features/auth';
import { ApiErrorResponse } from '@web/types';
import { AxiosError } from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import { localAuthJwt, refreshAccessToken, socialAuthJwtGoogle } from './services';

// Constante local para evitar import de @repo/shared
const TIME_MS = {
    HOUR: 60 * 60 * 1000,
};

/**
 * Build providers array dynamically
 * Solo incluye providers que están correctamente configurados
 */
const providers = [
    // Credentials provider (siempre disponible)
    CredentialsProvider({
        id: 'credentials',
        name: 'Email and Password',
        credentials: {
            email: {
                label: 'Email',
                type: 'email',
                placeholder: 'you@example.com',
            },
            password: {
                label: 'Password',
                type: 'password',
                placeholder: '••••••••',
            },
        },
        async authorize(credentials) {
            if (!credentials) {
                throw new Error('Missing credentials');
            }

            try {
                const { user, accessToken, refreshToken } = await authService.login({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (!user || !accessToken || !refreshToken) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    firstName: (user as any).firstName || '',
                    lastName: (user as any).lastName || '',
                    roles: (user as any).roles || [],
                    accessToken,
                    refreshToken,
                    accessTokenExpires: Date.now() + TIME_MS.HOUR,
                } as any;
            } catch (e) {
                const error = e as AxiosError;
                const errorData = error.response?.data as ApiErrorResponse;

                console.error('Auth error:', errorData);
                throw new Error(errorData?.message || 'Authentication failed');
            }
        },
    }),
];

// Google OAuth (solo si está configurado)
if (oauth.google.isConfigured) {
    providers.push(
        GoogleProvider({
            clientId: oauth.google.clientId,
            clientSecret: oauth.google.clientSecret,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
    );
} else {
    console.warn(
        '⚠️  Google OAuth not configured. Set OAUTH_GOOGLE_ID and OAUTH_GOOGLE_SECRET in .env.local',
    );
}

export const authOptions: NextAuthOptions = {
    // Debug solo en desarrollo
    debug: env.NODE_ENV === 'development',

    // JWT strategy para mejor performance
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // Providers configurados dinámicamente
    providers,

    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (account && user) {
                if (account.provider === 'credentials') {
                    token = await localAuthJwt(token, user);
                } else if (account.provider === 'google') {
                    token = await socialAuthJwtGoogle(token, profile as GoogleProfile);
                }
                return token;
            }

            if (token.error === 'RefreshAccessTokenError') {
                return token;
            }

            if (Date.now() < (token.accessTokenExpires ?? 0)) {
                return token;
            }

            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (token.error === 'RefreshAccessTokenError') {
                session.error = 'RefreshAccessTokenError';
                return session;
            }

            session.user = {
                ...token.user,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            };
            return session;
        },

        async redirect({ baseUrl }) {
            return `${baseUrl}/profile`;
        },
    },

    // Custom pages
    pages: {
        signIn: '/login',
        error: '/login',
    },

    // Secret para JWT
    secret: env.NEXTAUTH_SECRET,
};
