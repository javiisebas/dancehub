/**
 * ✨ PRAGMATIC ENTERPRISE: Auth Server Actions
 *
 * Server Actions para autenticación
 * - Type-safe automático con Zod
 * - Integración con NextAuth
 * - Error handling consistente
 *
 * @example
 * ```tsx
 * // Usar en form (3 líneas!)
 * <AutoForm
 *   schema={loginSchema}
 *   action={loginAction}
 *   submitText="Login"
 * />
 * ```
 */

'use server';

import { actionClient } from '@web/config/action-client';
import { signIn } from 'next-auth/react';
import { authService } from '../api/auth.service';
import { loginSchema, newPasswordSchema, registerSchema, resetPasswordSchema } from '../schemas';

/**
 * Login Action
 * Type-safe, auto-validated con Zod
 */
export const loginAction = actionClient.schema(loginSchema).action(async ({ parsedInput }) => {
    try {
        // Usar NextAuth signIn en lugar de authService directamente
        // Esto mantiene la sesión de NextAuth sincronizada
        const result = await signIn('credentials', {
            email: parsedInput.email,
            password: parsedInput.password,
            redirect: false,
        });

        if (result?.error) {
            throw new Error(result.error);
        }

        return {
            success: true,
            message: 'Login successful',
        };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
});

/**
 * Register Action
 */
export const registerAction = actionClient
    .schema(registerSchema)
    .action(async ({ parsedInput }) => {
        try {
            // ⚠️ Mapear fields del schema al DTO esperado por el API
            await authService.register({
                email: parsedInput.email,
                password: parsedInput.password,
                // Si tu API necesita firstName/lastName, ajusta el service o el DTO
            } as any);

            return {
                success: true,
                message: 'Registration successful. Please check your email to verify your account.',
            };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Registration failed');
        }
    });

/**
 * Reset Password Action
 */
export const resetPasswordAction = actionClient
    .schema(resetPasswordSchema)
    .action(async ({ parsedInput }) => {
        try {
            await authService.resetPassword({
                email: parsedInput.email,
            });

            return {
                success: true,
                message: 'Password reset email sent. Please check your inbox.',
            };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to send reset email');
        }
    });

/**
 * Set New Password Action
 * Schema con token incluido
 */
const newPasswordWithTokenSchema = newPasswordSchema.and(
    loginSchema.pick({ email: true }).extend({ token: loginSchema.shape.email }),
);

export const setNewPasswordAction = actionClient
    .schema(newPasswordWithTokenSchema)
    .action(async ({ parsedInput }) => {
        try {
            await authService.setNewPassword({
                password: parsedInput.password,
                token: parsedInput.token,
            } as any);

            return {
                success: true,
                message: 'Password updated successfully',
            };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to update password');
        }
    });
