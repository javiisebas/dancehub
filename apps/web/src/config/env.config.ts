/**
 * 🔐 ENVIRONMENT CONFIGURATION
 *
 * Validación y tipado de variables de entorno
 * - Type-safe
 * - Validación en build time (solo en servidor)
 * - Mensajes de error claros
 *
 * @example
 * ```ts
 * import { env } from '@web/config/env.config';
 *
 * console.log(env.NEXT_PUBLIC_API_URL);
 * console.log(env.NEXTAUTH_SECRET); // Solo en servidor
 * ```
 */

import { z } from 'zod';

/**
 * Environment Variables Schema
 * - Public variables (NEXT_PUBLIC_*) están disponibles en cliente y servidor
 * - Private variables solo están disponibles en servidor
 */
const envSchema = z.object({
    // Next.js
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // API (public - disponible en cliente)
    NEXT_PUBLIC_API_URL: z.string().url(),

    // NextAuth (private - solo servidor)
    NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
    NEXTAUTH_URL: z.string().url(),

    // Google OAuth (private - solo servidor)
    OAUTH_GOOGLE_ID: z.string().optional(),
    OAUTH_GOOGLE_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Solo se ejecuta en el servidor
 */
function validateEnv() {
    // En el cliente, no validar variables privadas
    if (typeof window !== 'undefined') {
        // Solo retornar variables públicas en el cliente
        return {
            NODE_ENV: process.env.NODE_ENV || 'development',
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
            NEXTAUTH_SECRET: '', // No disponible en cliente
            NEXTAUTH_URL: '', // No disponible en cliente
            OAUTH_GOOGLE_ID: '', // No disponible en cliente
            OAUTH_GOOGLE_SECRET: '', // No disponible en cliente
        } as Env;
    }

    // En el servidor, validar todo
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors.map(
                (err) => `  - ${err.path.join('.')}: ${err.message}`,
            );

            throw new Error(
                `❌ Invalid environment variables:\n${missingVars.join('\n')}\n\n` +
                    `Please check your .env.local file and ensure all required variables are set.`,
            );
        }
        throw error;
    }
}

/**
 * Validated environment variables
 * Safe to use throughout the application
 */
export const env = validateEnv();

/**
 * OAuth Configuration Helper
 * Safe para usar en el cliente - solo indica si está configurado
 */
export const oauth = {
    google: {
        // En cliente, verificar si las credenciales están configuradas sin exponerlas
        isConfigured:
            typeof window !== 'undefined'
                ? // En cliente: verificar si NEXT_PUBLIC indica que está configurado
                  false // Por defecto false en cliente, el servidor lo maneja
                : // En servidor: verificar las variables reales
                  !!env.OAUTH_GOOGLE_ID && !!env.OAUTH_GOOGLE_SECRET,
        // Solo disponibles en servidor
        clientId: typeof window === 'undefined' ? env.OAUTH_GOOGLE_ID || '' : '',
        clientSecret: typeof window === 'undefined' ? env.OAUTH_GOOGLE_SECRET || '' : '',
    },
};
