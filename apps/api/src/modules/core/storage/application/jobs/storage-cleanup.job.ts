import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StorageStatusEnum } from '@repo/shared';
import { and, eq, lt, sql } from 'drizzle-orm';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';
import { storages } from '../../infrastructure/schemas/storage.schema';
import { IStorageProvider } from '../services/storage-provider.interface';

@Injectable()
export class StorageCleanupJob {
    private readonly RETENTION_DAYS = 30;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly logger: LogService,
        @Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository,
        @Inject('STORAGE_PROVIDER') private readonly storageProvider: IStorageProvider,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async cleanupDeletedFiles(): Promise<void> {
        this.logger.log('Starting storage cleanup job...', 'StorageCleanupJob');

        try {
            const retentionDate = new Date();
            retentionDate.setDate(retentionDate.getDate() - this.RETENTION_DAYS);

            const deletedFiles = await this.databaseService.db
                .select()
                .from(storages)
                .where(
                    and(
                        eq(storages.status, StorageStatusEnum.DELETED),
                        lt(storages.updatedAt, retentionDate),
                    ),
                )
                .limit(100);

            if (deletedFiles.length === 0) {
                this.logger.log('No files to clean up', 'StorageCleanupJob');
                return;
            }

            let deletedCount = 0;
            let failedCount = 0;

            for (const file of deletedFiles) {
                try {
                    await this.storageProvider.delete(file.path);

                    await this.databaseService.db.delete(storages).where(eq(storages.id, file.id));

                    deletedCount++;
                } catch (error) {
                    failedCount++;
                    this.logger.error(
                        `Failed to delete file ${file.id}`,
                        error instanceof Error ? error.stack || '' : '',
                        'StorageCleanupJob',
                    );
                }
            }

            this.logger.log(
                `Storage cleanup completed: ${deletedCount} files deleted, ${failedCount} failed`,
                'StorageCleanupJob',
            );
        } catch (error) {
            this.logger.error(
                'Storage cleanup job failed',
                error instanceof Error ? error.stack || '' : '',
                'StorageCleanupJob',
            );
        }
    }

    @Cron(CronExpression.EVERY_WEEK)
    async cleanupFailedUploads(): Promise<void> {
        this.logger.log('Starting failed uploads cleanup...', 'StorageCleanupJob');

        try {
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 1);

            const failedUploads = await this.databaseService.db
                .select({ id: storages.id })
                .from(storages)
                .where(
                    and(
                        eq(storages.status, StorageStatusEnum.UPLOADING),
                        lt(storages.createdAt, dayAgo),
                    ),
                );

            if (failedUploads.length > 0) {
                await this.databaseService.db
                    .delete(storages)
                    .where(
                        and(
                            eq(storages.status, StorageStatusEnum.UPLOADING),
                            lt(storages.createdAt, dayAgo),
                        ),
                    );
            }

            this.logger.log(
                `Cleaned up ${failedUploads.length} failed uploads`,
                'StorageCleanupJob',
            );
        } catch (error) {
            this.logger.error(
                'Failed uploads cleanup job failed',
                error instanceof Error ? error.stack || '' : '',
                'StorageCleanupJob',
            );
        }
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async generateStorageReport(): Promise<void> {
        this.logger.log('Generating storage report...', 'StorageCleanupJob');

        try {
            const stats = await this.databaseService.db
                .select({
                    status: storages.status,
                    count: sql<number>`count(*)::int`,
                    totalSize: sql<number>`sum(${storages.size})::bigint`,
                })
                .from(storages)
                .groupBy(storages.status);

            const report = stats.map((stat) => ({
                status: stat.status,
                count: Number(stat.count),
                totalSizeMB: Number(stat.totalSize) / (1024 * 1024),
            }));

            this.logger.log(
                `Storage Report: ${JSON.stringify(report, null, 2)}`,
                'StorageCleanupJob',
            );
        } catch (error) {
            this.logger.error(
                'Storage report generation failed',
                error instanceof Error ? error.stack || '' : '',
                'StorageCleanupJob',
            );
        }
    }
}
