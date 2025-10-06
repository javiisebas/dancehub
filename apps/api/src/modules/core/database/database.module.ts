import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseService } from './services/database.service';
import { RepositoryRegistry } from './services/repository-registry.service';
import { UnitOfWorkInterceptor } from './unit-of-work/unit-of-work.interceptor';
import { UnitOfWorkService } from './unit-of-work/unit-of-work.service';

@Global()
@Module({
    providers: [
        DatabaseService,
        UnitOfWorkService,
        RepositoryRegistry,
        {
            provide: APP_INTERCEPTOR,
            useClass: UnitOfWorkInterceptor,
        },
    ],
    exports: [DatabaseService, UnitOfWorkService, RepositoryRegistry],
})
export class DatabaseModule {}
