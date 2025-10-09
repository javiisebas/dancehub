/**
 * ✨ PRAGMATIC ENTERPRISE: useAction Hook
 *
 * Hook personalizado para Server Actions con mejor UX:
 * - Loading states automáticos
 * - Toast notifications automáticas
 * - Error handling consistente
 * - Type-safe end-to-end
 *
 * @example
 * ```tsx
 * const { executeAsync, isExecuting } = useAction(loginAction, {
 *   onSuccess: () => router.push('/dashboard'),
 *   onError: (error) => console.error(error)
 * });
 * ```
 */

import { useAction as useActionBase } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseActionOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
    successMessage?: string;
    errorMessage?: string;
    redirectOnSuccess?: string;
}

/**
 * Wrapper del useAction de next-safe-action con mejor UX
 */
export function useAction<TInput, TOutput>(action: any, options?: UseActionOptions) {
    const router = useRouter();

    const result = useActionBase(action, {
        onSuccess: ({ data }) => {
            if (options?.successMessage) {
                toast.success(options.successMessage);
            }

            if (options?.redirectOnSuccess) {
                router.push(options.redirectOnSuccess);
            }

            options?.onSuccess?.(data);
        },
        onError: ({ error }) => {
            const errorMsg = error.serverError || options?.errorMessage || 'An error occurred';
            toast.error(errorMsg);
            options?.onError?.(errorMsg);
        },
    });

    return result;
}
