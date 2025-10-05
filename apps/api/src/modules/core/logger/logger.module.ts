import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggingInterceptor } from './interceptors/tracing.interceptor';
import { LogService } from './services/logger.service';
import { ObservabilityService } from './services/observability.service';

@Global()
@Module({
    providers: [
        LogService,
        ObservabilityService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestLoggingInterceptor,
        },
    ],
    exports: [LogService, ObservabilityService],
})
export class AppLoggerModule {}
