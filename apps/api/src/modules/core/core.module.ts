import { Global, Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { AppI18nModule } from './i18n/i18n.module';
import { AppLoggerModule } from './logger/logger.module';
import { PaymentModule } from './payment/payment.module';
import { AppQrModule } from './qr/qr.module';
import { AppScheduleModule } from './schedule/schedule.module';
import { StorageModule } from './storage/storage.module';
import { AppThrottlerModule } from './throttler/throttler.module';

const Modules = [
    AppConfigModule,
    AppI18nModule,
    AppLoggerModule,
    AppQrModule,
    AppScheduleModule,
    AppThrottlerModule,
    CacheModule,
    EventsModule,
    HealthModule,
    PaymentModule,
    StorageModule,
];

@Global()
@Module({
    imports: [...Modules],
    exports: [...Modules],
})
export class CoreModule {}
