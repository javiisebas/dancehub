import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { handleApiError, type ApiError } from '@web/lib/api';

export interface UseApiQueryOptions<TData, TError = ApiError>
    extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
    showErrorToast?: boolean;
    onError?: (error: TError) => void;
}

export interface UseApiMutationOptions<TData, TVariables, TError = ApiError>
    extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
    successMessage?: string;
    invalidateQueries?: string[][];
}

export function useApiQuery<TData>(
    queryKey: string[],
    queryFn: () => Promise<TData>,
    options: UseApiQueryOptions<TData> = {},
) {
    const { showErrorToast = true, onError, ...queryOptions } = options;

    return useQuery<TData, ApiError>({
        queryKey,
        queryFn: async () => {
            try {
                return await queryFn();
            } catch (error) {
                const apiError = handleApiError(error, {
                    showToast: showErrorToast,
                    rethrow: true,
                });
                throw apiError;
            }
        },
        ...queryOptions,
    });
}

export function useApiMutation<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options: UseApiMutationOptions<TData, TVariables> = {},
) {
    const queryClient = useQueryClient();
    const {
        showErrorToast = true,
        showSuccessToast = false,
        successMessage,
        invalidateQueries = [],
        onSuccess,
        onError,
        ...mutationOptions
    } = options;

    return useMutation<TData, ApiError, TVariables>({
        mutationFn: async (variables) => {
            try {
                return await mutationFn(variables);
            } catch (error) {
                const apiError = handleApiError(error, {
                    showToast: showErrorToast,
                    rethrow: true,
                });
                throw apiError;
            }
        },
        onSuccess: async (data, variables, context) => {
            if (showSuccessToast && successMessage) {
                const { toast } = await import('sonner');
                toast.success(successMessage);
            }

            for (const queryKey of invalidateQueries) {
                await queryClient.invalidateQueries({ queryKey });
            }

            onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            onError?.(error, variables, context);
        },
        ...mutationOptions,
    });
}

export function useInvalidateQuery() {
    const queryClient = useQueryClient();

    return (queryKey: string[]) => {
        return queryClient.invalidateQueries({ queryKey });
    };
}

export function useResetQuery() {
    const queryClient = useQueryClient();

    return (queryKey: string[]) => {
        return queryClient.resetQueries({ queryKey });
    };
}

export function usePrefetchQuery() {
    const queryClient = useQueryClient();

    return async <TData>(queryKey: string[], queryFn: () => Promise<TData>) => {
        await queryClient.prefetchQuery({
            queryKey,
            queryFn,
        });
    };
}
