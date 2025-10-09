import type { PresignedUrlResponse, StorageResponse, UploadFileResponse } from '@repo/shared';
import { StorageVisibilityEnum } from '@repo/shared';
import { BaseApiService } from '@web/lib/api';

interface VideoMetadata {
    lessonId?: string;
    courseId?: string;
    type?: string;
    [key: string]: string | number | boolean | undefined;
}

interface UploadVideoOptions {
    metadata?: VideoMetadata;
    visibility?: StorageVisibilityEnum;
    onProgress?: (progress: number) => void;
}

class VideoService extends BaseApiService {
    constructor() {
        super('/storage');
    }

    async uploadVideo(file: File, options?: UploadVideoOptions): Promise<UploadFileResponse> {
        const formData = new FormData();
        formData.append('file', file);

        if (options?.metadata) {
            formData.append('metadata', JSON.stringify(options.metadata));
        }

        // Default to AUTHENTICATED for videos (any logged-in user can access)
        const visibility = options?.visibility || StorageVisibilityEnum.AUTHENTICATED;
        formData.append('visibility', visibility);

        return this.uploadFile<UploadFileResponse>('/upload/video', formData, options?.onProgress);
    }

    async getVideo(storageId: string): Promise<StorageResponse> {
        return this.get<StorageResponse>(`/${storageId}`);
    }

    async getStreamingUrl(
        storageId: string,
        expiresIn: number = 3600,
    ): Promise<PresignedUrlResponse> {
        return this.get<PresignedUrlResponse>(`/${storageId}/presigned-url`, {
            queryParams: { expiresIn },
        });
    }

    async getPublicStreamingUrl(storageId: string): Promise<{ url: string }> {
        return this.get<{ url: string }>(`/${storageId}/public-url`);
    }

    async deleteVideo(storageId: string): Promise<void> {
        return this.delete<void>(`/${storageId}`);
    }

    async updateVideoMetadata(
        storageId: string,
        metadata: Record<string, unknown>,
    ): Promise<StorageResponse> {
        return this.patch<StorageResponse, { metadata: Record<string, unknown> }>(`/${storageId}`, {
            metadata,
        });
    }

    async listVideos(params: {
        page?: number;
        limit?: number;
        filter?: Record<string, unknown>;
    }): Promise<{ data: StorageResponse[]; total: number }> {
        return this.paginate(params);
    }
}

export const videoService = new VideoService();
