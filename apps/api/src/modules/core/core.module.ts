import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { AppI18nModule } from './i18n/i18n.module';
import { AppLoggerModule } from './logger/logger.module';
import { AppQrModule } from './qr/qr.module';
import { AppScheduleModule } from './schedule/schedule.module';
import { StorageModule } from './storage/storage.module';
import { AppThrottlerModule } from './throttler/throttler.module';

const Modules = [
    EventEmitterModule.forRoot({
        wildcard: true,
        delimiter: '.',
        newListener: false,
        removeListener: false,
        maxListeners: 10,
        verboseMemoryLeak: true,
        ignoreErrors: false,
    }),
    AppConfigModule,
    CacheModule,
    AppI18nModule,
    AppLoggerModule,
    AppQrModule,
    AppScheduleModule,
    AppThrottlerModule,
    StorageModule,
    HealthModule,
];

@Global()
@Module({
    imports: [...Modules],
    exports: [...Modules],
})
export class CoreModule {}
