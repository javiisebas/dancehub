import { toast } from 'sonner';
import { ApiError } from './base-service';

export interface ErrorHandlerOptions {
    showToast?: boolean;
    customMessage?: string;
    onError?: (error: ApiError) => void;
    rethrow?: boolean;
}

const defaultOptions: ErrorHandlerOptions = {
    showToast: true,
    rethrow: true,
};

export function handleApiError(error: unknown, options: ErrorHandlerOptions = {}): ApiError {
    const opts = { ...defaultOptions, ...options };
    const apiError = error instanceof ApiError ? error : ApiError.fromResponse(error);

    if (opts.showToast) {
        const message = opts.customMessage || apiError.message;

        switch (true) {
            case apiError.isAuthError:
                toast.error('Authentication Error', { description: message });
                break;
            case apiError.isValidationError:
                toast.error('Validation Error', { description: message });
                break;
            case apiError.isNotFound:
                toast.error('Not Found', { description: message });
                break;
            default:
                toast.error('Error', { description: message });
        }
    }

    if (opts.onError) {
        opts.onError(apiError);
    }

    if (opts.rethrow) {
        throw apiError;
    }

    return apiError;
}

export function createErrorHandler(defaultOptions: Partial<ErrorHandlerOptions> = {}) {
    return (error: unknown, options: ErrorHandlerOptions = {}) => {
        return handleApiError(error, { ...defaultOptions, ...options });
    };
}

export async function withErrorHandling<T>(
    fn: () => Promise<T>,
    options: ErrorHandlerOptions = {},
): Promise<T | null> {
    try {
        return await fn();
    } catch (error) {
        handleApiError(error, { ...options, rethrow: false });
        return null;
    }
}

export class RetryableError extends Error {
    constructor(
        message: string,
        public readonly attempt: number,
        public readonly maxAttempts: number,
    ) {
        super(message);
        this.name = 'RetryableError';
    }
}

export async function withRetry<T>(
    fn: () => Promise<T>,
    options: {
        maxAttempts?: number;
        delayMs?: number;
        backoff?: boolean;
        retryOn?: (error: ApiError) => boolean;
    } = {},
): Promise<T> {
    const {
        maxAttempts = 3,
        delayMs = 1000,
        backoff = true,
        retryOn = (error) => error.statusCode >= 500,
    } = options;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            const shouldRetry = retryOn(error);
            if (!shouldRetry || attempt === maxAttempts) {
                throw error;
            }

            const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}
