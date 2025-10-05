import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { ThumbnailSizeEnum } from '@repo/shared';
import { BaseThumbnailService } from './base-thumbnail.service';
import { ImageOptimizerService } from './image-optimizer.service';
import { IStorageProvider } from './storage-provider.interface';

@Injectable()
export class StorageThumbnailService extends BaseThumbnailService {
    constructor(
        private readonly imageOptimizer: ImageOptimizerService,
        @Inject('STORAGE_PROVIDER') storageProvider: IStorageProvider,
        databaseService: DatabaseService,
        logger: LogService,
    ) {
        super(storageProvider, databaseService, logger);
    }

    async generateAndSaveThumbnails(
        storageId: string,
        imageBuffer: Buffer,
        originalPath: string,
    ): Promise<void> {
        try {
            const thumbnails = await this.imageOptimizer.generateThumbnails(imageBuffer);
            const pathBase = this.extractPathBase(originalPath);

            const sizes = [
                { size: ThumbnailSizeEnum.SMALL, data: thumbnails.small },
                { size: ThumbnailSizeEnum.MEDIUM, data: thumbnails.medium },
                { size: ThumbnailSizeEnum.LARGE, data: thumbnails.large },
            ];

            await Promise.all(
                sizes.map(({ size, data }) => {
                    const path = this.generateThumbnailPath(pathBase, size);
                    return this.saveThumbnailToStorage(storageId, size, data, path);
                }),
            );

            this.logger.log(
                `Generated ${sizes.length} thumbnails for storage ${storageId}`,
                'StorageThumbnailService',
            );
        } catch (error) {
            this.logger.error(
                `Failed to generate thumbnails for storage ${storageId}`,
                error instanceof Error ? error.stack || '' : '',
                'StorageThumbnailService',
            );
            throw error;
        }
    }
}
