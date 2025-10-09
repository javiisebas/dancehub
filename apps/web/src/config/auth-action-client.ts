/**
 * 🔐 AUTH ACTION CLIENT
 *
 * Server Actions con autenticación requerida
 * - Verifica sesión activa
 * - Provee userId y roles en context
 * - Type-safe
 */

import { authOptions } from '@web/app/api/auth/[...nextauth]/options';
import { actionClient } from '@web/config/action-client';
import { getServerSession } from 'next-auth';

/**
 * Action client que requiere autenticación
 *
 * @example
 * ```ts
 * export const updateProfileAction = authenticatedActionClient
 *   .schema(updateProfileSchema)
 *   .action(async ({ parsedInput, ctx }) => {
 *     // ctx.userId y ctx.userRoles disponibles automáticamente
 *     return await userService.update(ctx.userId, parsedInput);
 *   });
 * ```
 */
export const authenticatedActionClient = actionClient.use(async ({ next }) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error('Unauthorized: Authentication required');
    }

    return next({
        ctx: {
            userId: session.user.id,
            userEmail: session.user.email || '',
            userRoles: (session.user as any).roles || [],
        },
    });
});

/**
 * Action client que requiere rol de admin
 *
 * @example
 * ```ts
 * export const deleteUserAction = adminActionClient
 *   .schema(deleteUserSchema)
 *   .action(async ({ parsedInput, ctx }) => {
 *     // Solo admins pueden ejecutar esto
 *     return await userService.delete(parsedInput.userId);
 *   });
 * ```
 */
export const adminActionClient = authenticatedActionClient.use(async ({ next, ctx }) => {
    if (!ctx.userRoles.includes('admin')) {
        throw new Error('Forbidden: Admin access required');
    }

    return next({ ctx });
});

/**
 * Action client para traductores y admins
 */
export const translatorActionClient = authenticatedActionClient.use(async ({ next, ctx }) => {
    const hasAccess = ctx.userRoles.includes('admin') || ctx.userRoles.includes('translator');

    if (!hasAccess) {
        throw new Error('Forbidden: Translator or Admin access required');
    }

    return next({ ctx });
});
