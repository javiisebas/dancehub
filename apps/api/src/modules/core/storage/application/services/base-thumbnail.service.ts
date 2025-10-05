import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { ThumbnailSizeEnum } from '@repo/shared';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { storageThumbnails } from '../../infrastructure/schemas/storage-thumbnail.schema';
import { IStorageProvider } from './storage-provider.interface';

export interface ThumbnailData {
    buffer: Buffer;
    width: number;
    height: number;
    size: number;
}

export abstract class BaseThumbnailService {
    constructor(
        protected readonly storageProvider: IStorageProvider,
        protected readonly databaseService: DatabaseService,
        protected readonly logger: LogService,
    ) {}

    protected async saveThumbnailToStorage(
        storageId: string,
        size: ThumbnailSizeEnum,
        thumbnail: ThumbnailData,
        path: string,
    ): Promise<void> {
        const mockFile = this.createMockFile(thumbnail.buffer, path);

        await this.storageProvider.upload(mockFile, path);

        await this.databaseService.db.insert(storageThumbnails).values({
            storageId,
            size,
            width: thumbnail.width,
            height: thumbnail.height,
            path,
            fileSize: thumbnail.size,
        });
    }

    protected createMockFile(buffer: Buffer, path: string): Express.Multer.File {
        const filename = path.split('/').pop() || 'thumbnail.webp';

        return {
            buffer,
            size: buffer.length,
            mimetype: 'image/webp',
            originalname: filename,
            fieldname: 'file',
            encoding: '7bit',
            stream: null as any,
            destination: '',
            filename: '',
            path: '',
        };
    }

    protected generateThumbnailPath(
        pathBase: string,
        size: ThumbnailSizeEnum,
        prefix: string = 'thumb',
    ): string {
        return `${pathBase}/${prefix}_${size}_${randomUUID()}.webp`;
    }

    async getThumbnailUrl(storageId: string, size: ThumbnailSizeEnum): Promise<string | null> {
        const result = await this.databaseService.db
            .select()
            .from(storageThumbnails)
            .where(
                and(eq(storageThumbnails.storageId, storageId), eq(storageThumbnails.size, size)),
            )
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        return this.storageProvider.getPublicUrl(result[0].path);
    }

    protected extractPathBase(originalPath: string): string {
        return originalPath.substring(0, originalPath.lastIndexOf('/'));
    }
}
