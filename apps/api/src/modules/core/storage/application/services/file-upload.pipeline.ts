import { Injectable } from '@nestjs/common';
import {
    StorageProviderEnum,
    StorageStatusEnum,
    StorageVisibilityEnum,
    UploadFileRequest,
} from '@repo/shared';
import { randomUUID } from 'crypto';
import { StorageBuilder } from '../../domain/entities/storage.builder';
import { Storage } from '../../domain/entities/storage.entity';
import { FileTypeValidator } from '../../infrastructure/validators/file-type.validator';
import { STORAGE_CONSTANTS } from '../constants/storage.constants';
import { FileProcessorRegistry, ProcessedFile } from './file-processor.strategy';
import { StoragePathService } from './storage-path.service';
import { StorageProgressService } from './storage-progress.service';
import { IStorageProvider } from './storage-provider.interface';
import { StorageThumbnailService } from './storage-thumbnail.service';
import { VideoThumbnailService } from './video-thumbnail.service';

/**
 * Type-safe file upload pipeline
 * Handles the entire upload flow with proper error handling and progress tracking
 */

export interface UploadContext {
    file: Express.Multer.File;
    userId: string | null;
    request: UploadFileRequest;
    uploadId: string;
}

export interface ProcessingResult {
    processedFile: ProcessedFile;
    originalFile: Express.Multer.File;
}

export interface UploadResult {
    storage: Storage;
}

@Injectable()
export class FileUploadPipeline {
    constructor(
        private readonly processorRegistry: FileProcessorRegistry,
        private readonly pathService: StoragePathService,
        private readonly progressService: StorageProgressService,
        private readonly thumbnailService: StorageThumbnailService,
        private readonly videoThumbnailService: VideoThumbnailService,
    ) {}

    /**
     * Execute the complete upload pipeline
     */
    async execute(
        context: UploadContext,
        storageProvider: IStorageProvider,
        saveStorage: (storage: Storage) => Promise<Storage>,
    ): Promise<UploadResult> {
        try {
            // 1. Start tracking
            await this.emitStart(context);

            // 2. Process file (optimize if applicable)
            const processingResult = await this.processFile(context);

            // 3. Upload to storage provider
            const uploadedPath = await this.uploadToProvider(
                context,
                processingResult,
                storageProvider,
            );

            // 4. Create and save storage entity
            const storage = await this.createAndSaveStorage(
                context,
                processingResult,
                uploadedPath,
                saveStorage,
            );

            // 5. Generate thumbnails (async, don't wait)
            this.generateThumbnailsAsync(context, processingResult, storage);

            // 6. Complete
            await this.emitComplete(context, storage.id);

            return { storage };
        } catch (error) {
            await this.emitError(context, error);
            throw error;
        }
    }

    private async emitStart(context: UploadContext): Promise<void> {
        if (context.userId) {
            this.progressService.emitUploadStart(
                context.userId,
                context.uploadId,
                context.file.originalname,
            );
        }
    }

    private async processFile(context: UploadContext): Promise<ProcessingResult> {
        const { file, userId, uploadId } = context;

        // Check if file needs processing
        if (this.processorRegistry.hasProcessor(file.mimetype)) {
            if (userId) {
                const type = FileTypeValidator.isImage(file.mimetype) ? 'image' : 'video';
                this.progressService.emitProcessingStart(userId, uploadId, type);
            }

            const processedFile = await this.processorRegistry.process(file);

            if (userId) {
                this.progressService.emitProcessingProgress(
                    userId,
                    uploadId,
                    STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.PROCESSING_COMPLETE,
                    'File optimized',
                );
            }

            return { processedFile, originalFile: file };
        }

        // No processing needed, return original
        return {
            processedFile: {
                buffer: file.buffer,
                size: file.size,
                extension: file.originalname.split('.').pop() || '',
                mimeType: file.mimetype,
            },
            originalFile: file,
        };
    }

    private async uploadToProvider(
        context: UploadContext,
        result: ProcessingResult,
        storageProvider: IStorageProvider,
    ): Promise<{ path: string; providerId?: string; size: number }> {
        const { userId, uploadId } = context;

        if (userId) {
            this.progressService.emitProcessingProgress(
                userId,
                uploadId,
                STORAGE_CONSTANTS.PROGRESS_PERCENTAGES.UPLOAD_TO_STORAGE,
                'Uploading to storage...',
            );
        }

        const filename = this.pathService.generateFilename(
            context.file.originalname,
            result.processedFile.extension,
        );
        const path = this.pathService.generatePath(userId, filename);

        // Create temporary multer file for upload
        const fileToUpload: Express.Multer.File = {
            ...context.file,
            buffer: result.processedFile.buffer,
            size: result.processedFile.size,
        };

        const uploadResult = await storageProvider.upload(fileToUpload, path);

        return {
            path: uploadResult.path,
            providerId: uploadResult.providerId,
            size: uploadResult.size,
        };
    }

    private async createAndSaveStorage(
        context: UploadContext,
        result: ProcessingResult,
        uploadedPath: { path: string; providerId?: string; size: number },
        saveStorage: (storage: Storage) => Promise<Storage>,
    ): Promise<Storage> {
        const storage = StorageBuilder.create()
            .withId(randomUUID())
            .withFile({
                filename: this.pathService.generateFilename(
                    context.file.originalname,
                    result.processedFile.extension,
                ),
                originalName: context.file.originalname,
                mimeType: result.processedFile.mimeType,
                size: uploadedPath.size,
            })
            .withExtension(result.processedFile.extension)
            .withPath(uploadedPath.path)
            .withProvider(StorageProviderEnum.R2, uploadedPath.providerId)
            .withVisibility(context.request.visibility ?? StorageVisibilityEnum.PRIVATE)
            .withStatus(StorageStatusEnum.ACTIVE)
            .withUser(context.userId)
            .withMetadata({ ...context.request.metadata, ...result.processedFile.metadata })
            .build();

        return saveStorage(storage);
    }

    private generateThumbnailsAsync(
        context: UploadContext,
        result: ProcessingResult,
        storage: Storage,
    ): void {
        const { file, userId, uploadId } = context;

        if (userId) {
            this.progressService.emitThumbnailGeneration(userId, uploadId);
        }

        if (FileTypeValidator.isImage(file.mimetype)) {
            this.thumbnailService
                .generateAndSaveThumbnails(storage.id, result.processedFile.buffer, storage.path)
                .catch((error) => {
                    console.error('Failed to generate image thumbnails:', error);
                });
        } else if (FileTypeValidator.isVideo(file.mimetype)) {
            this.videoThumbnailService
                .generateAndSaveVideoThumbnails(
                    storage.id,
                    result.originalFile.buffer,
                    storage.path,
                )
                .catch((error) => {
                    console.error('Failed to generate video thumbnails:', error);
                });
        }
    }

    private async emitComplete(context: UploadContext, storageId: string): Promise<void> {
        if (context.userId) {
            this.progressService.emitComplete(context.userId, context.uploadId, storageId);
        }
    }

    private async emitError(context: UploadContext, error: unknown): Promise<void> {
        if (context.userId) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            this.progressService.emitError(context.userId, context.uploadId, errorMessage);
        }
    }
}
