import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TIME } from '@repo/shared';
import { TypedConfigService } from '../config/config.service';
import { LogService } from '../logger/services/logger.service';
import { CustomThrottlerStorageService } from './throttler.service';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            inject: [TypedConfigService, CustomThrottlerStorageService, LogService],
            useFactory: (
                configService: TypedConfigService,
                storage: CustomThrottlerStorageService,
                logger: LogService,
            ) => {
                const isProduction = configService.get('app.isProduction', false);

                if (!isProduction) {
                    logger.debug('Throttling disabled in development', 'ThrottlerModule');
                    return {
                        throttlers: [],
                        storage: undefined,
                    };
                }

                return {
                    throttlers: [
                        {
                            name: 'short',
                            ttl: TIME.SECOND,
                            limit: 3,
                        },
                        {
                            name: 'medium',
                            ttl: 10 * TIME.SECOND,
                            limit: 20,
                        },
                        {
                            name: 'long',
                            ttl: TIME.MINUTE,
                            limit: 100,
                        },
                    ],
                    errorMessage: 'Too Many Requests',
                    storage,
                };
            },
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        CustomThrottlerStorageService,
    ],
    exports: [ThrottlerModule, CustomThrottlerStorageService],
})
export class AppThrottlerModule {}
