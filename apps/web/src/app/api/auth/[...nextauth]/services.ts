/**
 * 🔐 NEXTAUTH JWT SERVICES
 *
 * Servicios para integrar NextAuth con la API backend
 * - Local auth (email/password)
 * - Social OAuth (Google)
 * - Token refresh automático
 *
 * FLOW:
 * 1. NextAuth maneja la autenticación OAuth (Google)
 * 2. Enviamos los datos del usuario a nuestra API en /auth/social/login
 * 3. La API valida y devuelve nuestros propios tokens JWT
 * 4. Guardamos los tokens en la sesión de NextAuth
 * 5. Usamos los tokens para llamar a la API en cada request
 */

// ⚠️ NO importar runtime de @repo/shared en API routes (causa Reflect.getMetadata error en Edge Runtime)
// import { ProvidersEnum, TIME_MS } from '@repo/shared';

import { authService } from '@web/features/auth';
import { User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import { GoogleProfile } from 'next-auth/providers/google';

// Constantes locales para evitar import de @repo/shared en API routes
const TIME_MS = {
    HOUR: 60 * 60 * 1000,
};

enum ProvidersEnum {
    GOOGLE = 'google',
}

/**
 * Refresh Access Token
 *
 * Se llama automáticamente cuando el access token expira.
 * Usa el refresh token para obtener un nuevo access token del backend.
 *
 * @param token - JWT actual
 * @returns JWT actualizado o con error
 */
export const refreshAccessToken = async (token: JWT): Promise<JWT> => {
    try {
        if (!token.refreshToken) {
            throw new Error('No refresh token available');
        }

        console.log('🔄 Refreshing access token...');

        const refreshed = await authService.refreshAccessToken(token.refreshToken);
        if (!refreshed) throw new Error('Failed to refresh the access token');

        console.log('✅ Token refreshed successfully');

        return {
            ...token,
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            accessTokenExpires: Date.now() + TIME_MS.HOUR,
            user: refreshed.user as any,
        };
    } catch (error) {
        console.error('❌ Error refreshing access token:', error);
        return { ...token, error: 'RefreshAccessTokenError' };
    }
};

/**
 * Local Auth JWT
 *
 * Maneja el token JWT para autenticación local (email/password).
 * Se llama después de un login exitoso con credenciales.
 *
 * @param token - JWT actual
 * @param user - Usuario autenticado
 * @returns JWT con los datos del usuario y tokens
 */
export const localAuthJwt = async (token: JWT, user: User | AdapterUser): Promise<JWT> => {
    if (user) {
        token.user = {
            id: user.id,
            email: user.email || '',
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + TIME_MS.HOUR;
    }
    return token;
};

/**
 * Social Auth JWT - Google
 *
 * Integra Google OAuth con la API backend.
 *
 * FLOW:
 * 1. NextAuth obtiene el perfil de Google
 * 2. Llamamos a /auth/social/login con los datos del perfil
 * 3. La API crea o actualiza el usuario y devuelve JWT tokens
 * 4. Guardamos los tokens en la sesión
 *
 * @param token - JWT actual
 * @param profile - Perfil de Google
 * @returns JWT con los datos del usuario y tokens
 */
export const socialAuthJwtGoogle = async (token: JWT, profile: GoogleProfile): Promise<JWT> => {
    try {
        console.log('🔐 Google login - calling backend API...');

        const data = await authService.socialLogin({
            provider: ProvidersEnum.GOOGLE,
            providerId: profile.sub,
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            displayName: profile.name,
            image: profile.picture,
            verified: profile.email_verified,
        });

        token.user = {
            id: data.user.id,
            email: data.user.email,
            firstName: (data.user as any).firstName || '',
            lastName: (data.user as any).lastName || '',
            roles: (data.user as any).roles || [],
        };
        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
        token.accessTokenExpires = Date.now() + TIME_MS.HOUR;

        console.log('✅ Google login successful');
        return token;
    } catch (error) {
        console.error('❌ Google login failed:', error);
        throw error; // Let NextAuth handle the error
    }
};
