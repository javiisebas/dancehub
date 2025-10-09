import {
    PaginatedStorageRequest,
    StoragePaginatedResponse,
    StorageVisibilityEnum,
    UploadFileResponse,
} from '@repo/shared';
import { createAxiosInstance } from '@web/config/axios.config';

export interface UploadOptions {
    visibility?: StorageVisibilityEnum;
    metadata?: Record<string, any>;
    onUploadProgress?: (progressEvent: {
        loaded: number;
        total?: number;
        percentage: number;
    }) => void;
}

export class StorageService {
    private static async getClient() {
        return createAxiosInstance(true);
    }

    static async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadFileResponse> {
        const client = await this.getClient();

        const formData = new FormData();
        formData.append('file', file);

        if (options.visibility) {
            formData.append('visibility', options.visibility);
        }

        if (options.metadata) {
            formData.append('metadata', JSON.stringify(options.metadata));
        }

        const response = await client.post<UploadFileResponse>('/storage/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (options.onUploadProgress) {
                    const percentage = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;

                    options.onUploadProgress({
                        loaded: progressEvent.loaded,
                        total: progressEvent.total,
                        percentage,
                    });
                }
            },
        });

        return response.data;
    }

    static async uploadImage(file: File, options: UploadOptions = {}): Promise<UploadFileResponse> {
        const client = await this.getClient();

        const formData = new FormData();
        formData.append('file', file);

        if (options.visibility) {
            formData.append('visibility', options.visibility);
        }

        if (options.metadata) {
            formData.append('metadata', JSON.stringify(options.metadata));
        }

        const response = await client.post<UploadFileResponse>('/storage/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (options.onUploadProgress) {
                    const percentage = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;

                    options.onUploadProgress({
                        loaded: progressEvent.loaded,
                        total: progressEvent.total,
                        percentage,
                    });
                }
            },
        });

        return response.data;
    }

    static async uploadVideo(file: File, options: UploadOptions = {}): Promise<UploadFileResponse> {
        const client = await this.getClient();

        const formData = new FormData();
        formData.append('file', file);

        if (options.visibility) {
            formData.append('visibility', options.visibility);
        }

        if (options.metadata) {
            formData.append('metadata', JSON.stringify(options.metadata));
        }

        const response = await client.post<UploadFileResponse>('/storage/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (options.onUploadProgress) {
                    const percentage = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;

                    options.onUploadProgress({
                        loaded: progressEvent.loaded,
                        total: progressEvent.total,
                        percentage,
                    });
                }
            },
        });

        return response.data;
    }

    static async deleteFile(storageId: string): Promise<void> {
        const client = await this.getClient();
        await client.delete(`/storage/${storageId}`);
    }

    static async getFile(storageId: string): Promise<UploadFileResponse> {
        const client = await this.getClient();
        const response = await client.get<UploadFileResponse>(`/storage/${storageId}`);
        return response.data;
    }

    static async listFiles(
        params: PaginatedStorageRequest = {},
    ): Promise<StoragePaginatedResponse> {
        const client = await this.getClient();
        const response = await client.get<StoragePaginatedResponse>('/storage', { params });
        return response.data;
    }

    static async getPresignedUrl(storageId: string): Promise<{ url: string }> {
        const client = await this.getClient();
        const response = await client.get<{ url: string }>(`/storage/${storageId}/presigned-url`);
        return response.data;
    }

    static async downloadFile(storageId: string): Promise<Blob> {
        const presigned = await this.getPresignedUrl(storageId);
        const response = await fetch(presigned.url);
        return response.blob();
    }
}
