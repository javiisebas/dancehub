import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { ThumbnailSizeEnum } from '@repo/shared';
import sharp from 'sharp';
import { STORAGE_CONSTANTS } from '../constants/storage.constants';
import { BaseThumbnailService } from './base-thumbnail.service';
import { IStorageProvider } from './storage-provider.interface';
import { VideoProcessorService } from './video-processor.service';

@Injectable()
export class VideoThumbnailService extends BaseThumbnailService {
    constructor(
        private readonly videoProcessor: VideoProcessorService,
        @Inject('STORAGE_PROVIDER') storageProvider: IStorageProvider,
        databaseService: DatabaseService,
        logger: LogService,
    ) {
        super(storageProvider, databaseService, logger);
    }

    async generateAndSaveVideoThumbnails(
        storageId: string,
        videoBuffer: Buffer,
        originalPath: string,
    ): Promise<void> {
        try {
            const videoThumbnails = await this.videoProcessor.extractThumbnails(
                videoBuffer,
                3,
                STORAGE_CONSTANTS.VIDEO_OPTIMIZATION.MAX_WIDTH,
            );

            if (videoThumbnails.length === 0) {
                throw new Error('No thumbnails generated');
            }

            const firstThumbnail = videoThumbnails[0];
            const pathBase = this.extractPathBase(originalPath);

            const sizes = [
                ThumbnailSizeEnum.SMALL,
                ThumbnailSizeEnum.MEDIUM,
                ThumbnailSizeEnum.LARGE,
            ];

            await Promise.all(
                sizes.map((size) =>
                    this.processAndSaveVideoThumbnail(
                        storageId,
                        firstThumbnail.buffer,
                        pathBase,
                        size,
                    ),
                ),
            );

            this.logger.log(
                `Generated ${sizes.length} thumbnails for video ${storageId}`,
                'VideoThumbnailService',
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack || '' : '';
            this.logger.error(
                `Failed to generate thumbnails for video ${storageId}: ${errorMessage}`,
                errorStack,
                'VideoThumbnailService',
            );
            throw error;
        }
    }

    private async processAndSaveVideoThumbnail(
        storageId: string,
        thumbnailBuffer: Buffer,
        pathBase: string,
        size: ThumbnailSizeEnum,
    ): Promise<void> {
        const dimensions = STORAGE_CONSTANTS.THUMBNAIL_SIZES[size];

        const resizedBuffer = await sharp(thumbnailBuffer)
            .resize(dimensions.width, dimensions.height, {
                fit: 'cover',
                position: 'center',
            })
            .webp({ quality: STORAGE_CONSTANTS.IMAGE_OPTIMIZATION.THUMBNAIL_QUALITY })
            .toBuffer();

        const metadata = await sharp(resizedBuffer).metadata();
        const path = this.generateThumbnailPath(pathBase, size, 'thumb_video');

        await this.saveThumbnailToStorage(
            storageId,
            size,
            {
                buffer: resizedBuffer,
                width: metadata.width || dimensions.width,
                height: metadata.height || dimensions.height,
                size: resizedBuffer.length,
            },
            path,
        );
    }
}
