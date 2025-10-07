import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseService } from './services/database.service';
import { UnitOfWorkInterceptor } from './unit-of-work/unit-of-work.interceptor';
import { UnitOfWorkService } from './unit-of-work/unit-of-work.service';

@Global()
@Module({
    providers: [
        DatabaseService,
        UnitOfWorkService,
        {
            provide: APP_INTERCEPTOR,
            useClass: UnitOfWorkInterceptor,
        },
    ],
    exports: [DatabaseService, UnitOfWorkService],
})
export class DatabaseModule {}
