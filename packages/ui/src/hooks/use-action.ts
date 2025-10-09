import { useAction as useActionBase } from 'next-safe-action/hooks';
import { toast } from 'sonner';

interface UseActionOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
    successMessage?: string;
    errorMessage?: string;
}

export function useAction<TInput, TOutput>(action: any, options?: UseActionOptions) {
    const result = useActionBase(action, {
        onSuccess: ({ data }) => {
            if (options?.successMessage) {
                toast.success(options.successMessage, {} as any);
            }
            options?.onSuccess?.(data);
        },
        onError: ({ error }) => {
            const errorMsg = String(
                error.serverError || options?.errorMessage || 'An error occurred',
            );
            toast.error(errorMsg, {} as any);
            options?.onError?.(errorMsg);
        },
    });

    return result;
}
