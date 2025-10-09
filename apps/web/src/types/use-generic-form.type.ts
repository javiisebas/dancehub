export interface UseGenericForm<T> {
    onSubmit: (data: T) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}
