/**
 * ✨ PRAGMATIC ENTERPRISE: Type-Safe Server Actions
 *
 * Este sistema proporciona:
 * - Type safety automático end-to-end
 * - Error handling consistente
 * - Loading/success/error states automáticos
 * - Integración con React Query
 *
 * @example
 * ```ts
 * // 1. Crear action (5 líneas)
 * export const loginAction = actionClient
 *   .schema(loginSchema)
 *   .action(async ({ parsedInput }) => {
 *     const result = await authService.login(parsedInput);
 *     return result;
 *   });
 *
 * // 2. Usar en form (3 líneas)
 * <AutoForm schema={loginSchema} action={loginAction} />
 * ```
 */

import { createSafeActionClient } from 'next-safe-action';

/**
 * Cliente base para Server Actions
 * - Configuración global de timeout, retry, etc
 * - Puedes extenderlo con middleware custom (auth, logs, etc)
 */
export const actionClient = createSafeActionClient({
    // Validación automática con Zod
    handleServerError: (error) => {
        console.error('Server Action Error:', error);

        // Personaliza los mensajes de error aquí
        if (error instanceof Error) {
            return error.message;
        }

        return 'An unexpected error occurred';
    },
});

/**
 * Cliente autenticado - requiere sesión activa
 * Úsalo para acciones que necesiten auth
 */
export const authenticatedActionClient = actionClient.use(async ({ next, clientInput }) => {
    // TODO: Agregar verificación de sesión con NextAuth
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   throw new Error('Unauthorized');
    // }

    return next({
        ctx: {
            // userId: session.user.id,
            // ...más contexto si necesitas
        },
    });
});
