import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { UploadProgressEvent, UploadProgressPhaseEnum, UploadProgressTypeEnum } from '@repo/shared';
import { StorageProgressGateway } from '../../infrastructure/gateways/storage-progress.gateway';
import { STORAGE_CONSTANTS } from '../constants/storage.constants';

@Injectable()
export class StorageProgressService {
    constructor(
        private readonly gateway: StorageProgressGateway,
        private readonly logger: LogService,
    ) {}

    emitUploadStart(userId: string, uploadId: string, filename: string) {
        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.UPLOAD,
            phase: UploadProgressPhaseEnum.SERVER_UPLOAD,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.UPLOAD_START,
            messageKey: 'upload.starting',
            defaultMessage: 'Starting upload...',
            data: { filename },
        };
        this.logger.log(
            `[Progress] Upload started - uploadId: ${uploadId}, filename: ${filename}`,
            'StorageProgressService',
        );
        this.gateway.emitProgress(userId, event);
    }

    emitUploadProgress(userId: string, uploadId: string, progress: number) {
        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.UPLOAD,
            phase: UploadProgressPhaseEnum.SERVER_UPLOAD,
            progress,
            messageKey: 'upload.uploading_server',
            defaultMessage: 'Uploading to server...',
        };
        this.gateway.emitProgress(userId, event);
    }

    emitProcessingStart(userId: string, uploadId: string, type: 'image' | 'video') {
        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.PROCESSING,
            phase: UploadProgressPhaseEnum.METADATA_EXTRACTION,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.PROCESSING_START,
            messageKey: `upload.processing.${type}`,
            defaultMessage: `Processing ${type}...`,
            data: { type },
        };
        this.gateway.emitProgress(userId, event);
    }

    emitProcessingProgress(userId: string, uploadId: string, progress: number, message: string) {
        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.PROCESSING,
            phase: UploadProgressPhaseEnum.METADATA_EXTRACTION,
            progress,
            messageKey: 'upload.processing',
            defaultMessage: message,
        };
        this.gateway.emitProgress(userId, event);
    }

    emitThumbnailGeneration(userId: string, uploadId: string) {
        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.THUMBNAIL,
            phase: UploadProgressPhaseEnum.THUMBNAIL_GENERATION,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.THUMBNAIL_GENERATION,
            messageKey: 'upload.generating_thumbnails',
            defaultMessage: 'Generating thumbnails...',
        };
        this.gateway.emitProgress(userId, event);
    }

    emitComplete(userId: string, uploadId: string, storageId: string, url?: string) {
        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.COMPLETE,
            phase: UploadProgressPhaseEnum.COMPLETE,
            progress: STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.COMPLETE,
            messageKey: 'upload.complete',
            defaultMessage: 'Upload complete!',
            data: { storageId, url },
        };
        this.logger.log(
            `[Progress] Upload complete - uploadId: ${uploadId}, storageId: ${storageId}`,
            'StorageProgressService',
        );
        this.gateway.emitProgress(userId, event);
    }

    emitError(userId: string, uploadId: string, error: string) {
        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.ERROR,
            phase: UploadProgressPhaseEnum.COMPLETE,
            progress: 0,
            messageKey: 'upload.error',
            defaultMessage: 'Upload failed',
            data: { error },
        };
        this.gateway.emitProgress(userId, event);
    }

    emitR2UploadProgress(userId: string, uploadId: string, r2Progress: number) {
        const start = STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.UPLOAD_TO_STORAGE_START;
        const end = STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.UPLOAD_TO_STORAGE_END;
        const range = end - start;
        const mappedProgress = Math.round(start + (r2Progress / 100) * range);
        const clampedProgress = Math.min(Math.max(mappedProgress, start), end);

        const event: UploadProgressEvent = {
            uploadId,
            type: UploadProgressTypeEnum.PROCESSING,
            phase: UploadProgressPhaseEnum.R2_UPLOAD,
            progress: clampedProgress,
            messageKey: 'upload.cloud_storage',
            defaultMessage: 'Uploading to cloud storage...',
            data: {
                r2Progress,
            },
        };

        if (r2Progress === 0 || r2Progress === 50 || r2Progress === 100) {
            this.logger.log(
                `[Progress] R2 upload ${r2Progress}% - uploadId: ${uploadId}, overall: ${clampedProgress}%`,
                'StorageProgressService',
            );
        }

        this.gateway.emitProgress(userId, event);
    }
}
