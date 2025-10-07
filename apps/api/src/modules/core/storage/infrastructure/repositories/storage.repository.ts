import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable, Provider } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Storage } from '../../domain/entities/storage.entity';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';
import { storages } from '../schemas/storage.schema';

@Injectable()
export class StorageRepositoryImpl
    extends BaseRepository<Storage, typeof storages>
    implements IStorageRepository
{
    protected readonly table = storages;
    protected readonly entityName = 'Storage';
    protected readonly repositoryToken = STORAGE_REPOSITORY;

    protected toDomain(schema: typeof storages.$inferSelect): Storage {
        return new Storage(
            schema.id,
            schema.filename,
            schema.originalName,
            schema.mimeType,
            schema.extension,
            schema.size,
            schema.path,
            schema.provider as any,
            schema.providerId ?? null,
            schema.visibility as any,
            schema.status as any,
            schema.userId ?? null,
            schema.metadata as Record<string, any> | null,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Storage): any {
        return {
            filename: entity.filename,
            originalName: entity.originalName,
            mimeType: entity.mimeType,
            extension: entity.extension,
            size: entity.size,
            path: entity.path,
            provider: entity.provider,
            ...(entity.providerId && { providerId: entity.providerId }),
            visibility: entity.visibility,
            status: entity.status,
            ...(entity.userId && { userId: entity.userId }),
            ...(entity.metadata && { metadata: entity.metadata }),
        };
    }

    async findByUserId(userId: string): Promise<Storage[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.userId, userId));

        return results.map((result) => this.toDomain(result));
    }

    async findByPath(path: string): Promise<Storage | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.path, path))
            .limit(1);

        return result.length > 0 ? this.toDomain(result[0]) : null;
    }
}

export const StorageRepositoryProvider: Provider = {
    provide: STORAGE_REPOSITORY,
    useClass: StorageRepositoryImpl,
};
