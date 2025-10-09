import { Injectable } from '@nestjs/common';
import { UploadProgressTypeEnum } from '@repo/shared';
import { StorageProgressGateway } from '../../infrastructure/gateways/storage-progress.gateway';
import { STORAGE_CONSTANTS } from '../constants/storage.constants';

@Injectable()
export class StorageProgressService {
    constructor(private readonly gateway: StorageProgressGateway) {}

    emitUploadStart(userId: string, uploadId: string, filename: string) {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.UPLOAD,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.UPLOAD_START,
            message: `Starting upload: ${filename}`,
            data: { filename },
        });
    }

    emitUploadProgress(userId: string, uploadId: string, progress: number) {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.UPLOAD,
            progress,
            message: `Uploading... ${progress}%`,
        });
    }

    emitProcessingStart(userId: string, uploadId: string, type: 'image' | 'video') {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.PROCESSING,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.PROCESSING_START,
            message: `Processing ${type}...`,
            data: { type },
        });
    }

    emitProcessingProgress(userId: string, uploadId: string, progress: number, message: string) {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.PROCESSING,
            progress,
            message,
        });
    }

    emitThumbnailGeneration(userId: string, uploadId: string) {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.THUMBNAIL,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.THUMBNAIL_GENERATION,
            message: 'Generating thumbnails...',
        });
    }

    emitComplete(userId: string, uploadId: string, storageId: string, url?: string) {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.COMPLETE,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.COMPLETE,
            message: 'Upload complete!',
            data: { storageId, url },
        });
    }

    emitError(userId: string, uploadId: string, error: string) {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.ERROR,
            progress: 0,
            message: `Error: ${error}`,
            data: { error },
        });
    }

    emitR2UploadProgress(
        userId: string,
        uploadId: string,
        overallProgress: number,
        r2Progress: number,
    ) {
        this.gateway.emitProgress(userId, {
            uploadId,
            type: UploadProgressTypeEnum.PROCESSING,
            progress: overallProgress,
            message: `Subiendo a R2 storage... ${r2Progress}%`,
            data: {
                r2Progress,
                phase: 'r2-upload',
            },
        });
    }
}
