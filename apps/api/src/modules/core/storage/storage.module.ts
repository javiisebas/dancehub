import { Global, Module, Provider } from '@nestjs/common';
import { CreateStorageHandler } from './application/commands/create-storage.handler';
import { DeleteStorageHandler } from './application/commands/delete-storage.handler';
import { UpdateStorageHandler } from './application/commands/update-storage.handler';
import { StorageCleanupJob } from './application/jobs/storage-cleanup.job';
import { GetPaginatedStoragesHandler } from './application/queries/get-paginated-storages.handler';
import { GetStorageHandler } from './application/queries/get-storage.handler';
import { ImageOptimizerService } from './application/services/image-optimizer.service';
import { R2StorageProviderService } from './application/services/r2-storage-provider.service';
import { StorageProgressService } from './application/services/storage-progress.service';
import { StorageThumbnailService } from './application/services/storage-thumbnail.service';
import { StorageService } from './application/services/storage.service';
import { VideoProcessorService } from './application/services/video-processor.service';
import { VideoThumbnailService } from './application/services/video-thumbnail.service';
import { STORAGE_REPOSITORY } from './domain/repositories/i-storage.repository';
import { StorageController } from './infrastructure/controllers/storage.controller';
import { StorageProgressGateway } from './infrastructure/gateways/storage-progress.gateway';
import { StorageAccessGuard } from './infrastructure/guards/storage-access.guard';
import { StorageOwnershipGuard } from './infrastructure/guards/storage-ownership.guard';
import { StorageUrlInterceptor } from './infrastructure/interceptors/storage-url.interceptor';
import { StorageRepositoryImpl } from './infrastructure/repositories/storage.repository';

const CommandHandlers: Provider[] = [
    CreateStorageHandler,
    UpdateStorageHandler,
    DeleteStorageHandler,
];

const QueryHandlers: Provider[] = [GetStorageHandler, GetPaginatedStoragesHandler];

const Services: Provider[] = [
    // Core services
    StorageService,

    // File processing
    ImageOptimizerService,
    VideoProcessorService,

    // Thumbnails
    StorageThumbnailService,
    VideoThumbnailService,

    // Progress tracking
    StorageProgressService,
    StorageProgressGateway,

    // Jobs
    StorageCleanupJob,

    // Guards & Interceptors
    StorageAccessGuard,
    StorageOwnershipGuard,
    StorageUrlInterceptor,

    // Storage provider
    {
        provide: 'STORAGE_PROVIDER',
        useClass: R2StorageProviderService,
    },
];

const Repositories: Provider[] = [
    {
        provide: STORAGE_REPOSITORY,
        useClass: StorageRepositoryImpl,
    },
];

@Global()
@Module({
    controllers: [StorageController],
    providers: [...Repositories, ...CommandHandlers, ...QueryHandlers, ...Services],
    exports: [STORAGE_REPOSITORY, StorageService],
})
export class StorageModule {}
