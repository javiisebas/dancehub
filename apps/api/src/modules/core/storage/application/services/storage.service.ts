import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
    StorageProviderEnum,
    StorageStatusEnum,
    StorageVisibilityEnum,
    UploadFileRequest,
} from '@repo/shared';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Storage } from '../../domain/entities/storage.entity';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';
import { FileTypeValidator } from '../../infrastructure/validators/file-type.validator';
import { STORAGE_CONSTANTS } from '../constants/storage.constants';
import { ImageOptimizerService } from './image-optimizer.service';
import { StorageProgressService } from './storage-progress.service';
import { IStorageProvider } from './storage-provider.interface';
import { StorageThumbnailService } from './storage-thumbnail.service';
import { VideoProcessorService } from './video-processor.service';
import { VideoThumbnailService } from './video-thumbnail.service';

@Injectable()
export class StorageService {
    constructor(
        @Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository,
        @Inject('STORAGE_PROVIDER') private readonly storageProvider: IStorageProvider,
        private readonly imageOptimizer: ImageOptimizerService,
        private readonly thumbnailService: StorageThumbnailService,
        private readonly videoProcessor: VideoProcessorService,
        private readonly videoThumbnailService: VideoThumbnailService,
        private readonly progressService: StorageProgressService,
    ) {}

    async uploadFile(
        file: Express.Multer.File,
        userId: string | null,
        request: UploadFileRequest,
        uploadId?: string,
    ): Promise<Storage> {
        const trackingId = uploadId || randomUUID();

        try {
            if (userId) {
                this.progressService.emitUploadStart(userId, trackingId, file.originalname);
            }

            let processedFile = file;
            let finalExtension = extname(file.originalname).slice(1);
            let finalMimeType = file.mimetype;
            let videoMetadata = null;

            if (this.imageOptimizer.isImageOptimizable(file.mimetype)) {
                if (userId) {
                    this.progressService.emitProcessingStart(userId, trackingId, 'image');
                }

                const optimized = await this.imageOptimizer.optimizeImage(
                    file.buffer,
                    file.mimetype,
                );
                processedFile = {
                    ...file,
                    buffer: optimized.buffer,
                    size: optimized.optimizedSize,
                };
                finalExtension = optimized.format;
                finalMimeType = `image/${optimized.format}`;

                if (userId) {
                    this.progressService.emitProcessingProgress(
                        userId,
                        trackingId,
                        STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.PROCESSING_COMPLETE,
                        'Image optimized',
                    );
                }
            }

            if (this.videoProcessor.isVideoOptimizable(file.mimetype)) {
                if (userId) {
                    this.progressService.emitProcessingStart(userId, trackingId, 'video');
                }

                const optimized = await this.videoProcessor.optimizeVideo(file.buffer);
                processedFile = {
                    ...file,
                    buffer: optimized.buffer,
                    size: optimized.optimizedSize,
                };
                finalExtension = 'mp4';
                finalMimeType = 'video/mp4';
                videoMetadata = {
                    duration: optimized.metadata.duration,
                    width: optimized.metadata.width,
                    height: optimized.metadata.height,
                    codec: optimized.metadata.codec,
                    bitrate: optimized.metadata.bitrate,
                    fps: optimized.metadata.fps,
                };

                if (userId) {
                    this.progressService.emitProcessingProgress(
                        userId,
                        trackingId,
                        STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.PROCESSING_COMPLETE,
                        'Video optimized',
                    );
                }
            }

            if (userId) {
                this.progressService.emitProcessingProgress(
                    userId,
                    trackingId,
                    STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.UPLOAD_TO_STORAGE,
                    'Uploading to storage...',
                );
            }

            const filename = this.generateFilename(processedFile, finalExtension);
            const path = this.generatePath(userId, filename);

            const uploadResult = await this.storageProvider.upload(processedFile, path);

            const storage = Storage.create(
                randomUUID(),
                filename,
                file.originalname,
                finalMimeType,
                finalExtension,
                uploadResult.size,
                uploadResult.path,
                StorageProviderEnum.R2,
                uploadResult.providerId ?? null,
                request.visibility ?? StorageVisibilityEnum.PRIVATE,
                StorageStatusEnum.ACTIVE,
                userId,
                { ...request.metadata, ...videoMetadata },
            );

            const savedStorage = await this.repository.save(storage);

            if (FileTypeValidator.isImage(file.mimetype)) {
                if (userId) {
                    this.progressService.emitThumbnailGeneration(userId, trackingId);
                }

                await this.thumbnailService
                    .generateAndSaveThumbnails(savedStorage.id, processedFile.buffer, path)
                    .catch((error) => {
                        console.error('Failed to generate image thumbnails:', error);
                    });
            }

            if (FileTypeValidator.isVideo(file.mimetype)) {
                if (userId) {
                    this.progressService.emitThumbnailGeneration(userId, trackingId);
                }

                await this.videoThumbnailService
                    .generateAndSaveVideoThumbnails(savedStorage.id, file.buffer, path)
                    .catch((error) => {
                        console.error('Failed to generate video thumbnails:', error);
                    });
            }

            if (userId) {
                this.progressService.emitComplete(userId, trackingId, savedStorage.id);
            }

            return savedStorage;
        } catch (error) {
            if (userId) {
                const errorMessage = error instanceof Error ? error.message : 'Upload failed';
                this.progressService.emitError(userId, trackingId, errorMessage);
            }
            throw error;
        }
    }

    async getPresignedUrl(
        storageId: string,
        userId: string | null,
        expiresIn: number = 3600,
    ): Promise<{ url: string; expiresAt: Date }> {
        const storage = await this.repository.findById(storageId);
        if (!storage) {
            throw new NotFoundException(`Storage with id ${storageId} not found`);
        }

        if (!storage.canBeAccessedBy(userId)) {
            throw new ForbiddenException('You do not have permission to access this file');
        }

        const url = await this.storageProvider.getPresignedUrl(storage.path, expiresIn);
        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        return { url, expiresAt };
    }

    async getPublicUrl(storageId: string): Promise<string> {
        const storage = await this.repository.findById(storageId);
        if (!storage) {
            throw new NotFoundException(`Storage with id ${storageId} not found`);
        }

        if (!storage.isPublic()) {
            throw new ForbiddenException('This file is not publicly accessible');
        }

        return this.storageProvider.getPublicUrl(storage.path);
    }

    async deleteFile(storageId: string, userId: string | null): Promise<void> {
        const storage = await this.repository.findById(storageId);
        if (!storage) {
            throw new NotFoundException(`Storage with id ${storageId} not found`);
        }

        if (userId && !storage.belongsToUser(userId)) {
            throw new ForbiddenException('You do not have permission to delete this file');
        }

        await this.storageProvider.delete(storage.path);

        storage.markAsDeleted();
        await this.repository.updateEntity(storage);
    }

    private generateFilename(file: Express.Multer.File, extension?: string): string {
        const uniqueId = randomUUID();
        const ext = extension || extname(file.originalname).slice(1);
        return `${uniqueId}.${ext}`;
    }

    private generatePath(userId: string | null, filename: string): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        if (userId) {
            return `users/${userId}/${year}/${month}/${filename}`;
        }

        return `public/${year}/${month}/${filename}`;
    }
}
