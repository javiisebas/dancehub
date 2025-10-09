import { apiClient } from '@web/api';
import type { ApiErrorResponse } from '@web/types/api-error-response.types';

export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: Record<string, 'asc' | 'desc'>;
    filter?: Record<string, unknown>;
}

export interface RequestConfig {
    withAuth?: boolean;
    signal?: AbortSignal;
    timeout?: number;
}

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public error: string,
        message: string,
        public details?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static fromResponse(error: unknown): ApiError {
        const err = error as {
            response?: { data?: ApiErrorResponse };
            status?: number;
            message?: string;
        };
        const response = err.response?.data;
        return new ApiError(
            response?.statusCode || err.status || 500,
            response?.error || 'Unknown Error',
            response?.message || err.message || 'An unexpected error occurred',
            response,
        );
    }

    get isValidationError(): boolean {
        return this.statusCode === 400 || this.statusCode === 422;
    }

    get isAuthError(): boolean {
        return this.statusCode === 401 || this.statusCode === 403;
    }

    get isNotFound(): boolean {
        return this.statusCode === 404;
    }
}

export abstract class BaseApiService {
    constructor(protected readonly baseEndpoint: string) {}

    protected buildQueryString(params: PaginationParams): string {
        const queryParams = new URLSearchParams();

        if (params.page !== undefined) {
            queryParams.append('page', params.page.toString());
        }
        if (params.limit !== undefined) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params.sort) {
            queryParams.append('sort', JSON.stringify(params.sort));
        }
        if (params.filter) {
            queryParams.append('filter', JSON.stringify(params.filter));
        }

        const queryString = queryParams.toString();
        return queryString ? `?${queryString}` : '';
    }

    protected buildUrl(path: string = '', queryParams?: Record<string, any>): string {
        let url = `${this.baseEndpoint}${path}`;

        if (queryParams) {
            const params = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        return url;
    }

    protected async get<T>(
        path: string = '',
        options?: { config?: RequestConfig; queryParams?: Record<string, any> },
    ): Promise<T> {
        try {
            const url = options?.queryParams
                ? this.buildUrl(path, options.queryParams)
                : this.buildUrl(path);
            return await apiClient.get<T>(url, options?.config?.withAuth !== false);
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    protected async post<T, D = any>(
        path: string = '',
        data?: D,
        config: RequestConfig = {},
    ): Promise<T> {
        try {
            return await apiClient.post<T, D>(this.buildUrl(path), data, config.withAuth !== false);
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    protected async put<T, D = any>(
        path: string = '',
        data?: D,
        config: RequestConfig = {},
    ): Promise<T> {
        try {
            return await apiClient.put<T, D>(this.buildUrl(path), data, config.withAuth !== false);
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    protected async patch<T, D = any>(
        path: string = '',
        data?: D,
        config: RequestConfig = {},
    ): Promise<T> {
        try {
            return await apiClient.patch<T, D>(
                this.buildUrl(path),
                data,
                config.withAuth !== false,
            );
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    protected async delete<T>(path: string = '', config: RequestConfig = {}): Promise<T> {
        try {
            return await apiClient.delete<T>(this.buildUrl(path), config.withAuth !== false);
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    protected async uploadFile<T>(
        path: string = '',
        formData: FormData,
        onProgress?: (progress: number) => void,
        config: RequestConfig = {},
    ): Promise<T> {
        try {
            return await apiClient.uploadFile<T>(
                this.buildUrl(path),
                formData,
                config.withAuth !== false,
                onProgress,
            );
        } catch (error) {
            throw ApiError.fromResponse(error);
        }
    }

    protected async paginate<T>(params: PaginationParams, path: string = ''): Promise<T> {
        const queryString = this.buildQueryString(params);
        return this.get<T>(`${path}${queryString}`);
    }
}
