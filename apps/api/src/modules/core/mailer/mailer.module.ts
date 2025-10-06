import { EMAIL_LOG_QUEUE } from '@api/common/constants/email-log.constants';
import { EMAIL_QUEUE } from '@api/common/constants/email.constants';
import { BullModule } from '@nestjs/bull';
import { Global, Module, Provider } from '@nestjs/common';
import { TypedConfigService } from '../config/config.service';
import { CreateEmailLogHandler } from './application/commands/create-email-log.handler';
import { UpdateEmailLogHandler } from './application/commands/update-email-log.handler';
import { EmailLogProcessor } from './application/processors/email-log.processor';
import { EmailProcessor } from './application/processors/email.processor';
import { FindFailedOrStuckEmailLogsHandler } from './application/queries/find-failed-or-stuck-email-logs.handler';
import { EmailLogQueueService } from './application/services/email-log-queue.service';
import { EmailProviderService } from './application/services/email-provider.service';
import { EmailQueueService } from './application/services/email-queue.service';
import { EmailRetryService } from './application/services/email-retry.service';
import { EmailTemplateRendererService } from './application/services/email-template-renderer.service';
import { EmailService } from './application/services/email.service';
import { EMAIL_LOG_REPOSITORY } from './domain/repositories/i-email-log.repository';
import { EmailLogRepositoryImpl } from './infrastructure/repositories/email-log.repository';

const CommandHandlers: Provider[] = [CreateEmailLogHandler, UpdateEmailLogHandler];
const QueryHandlers: Provider[] = [FindFailedOrStuckEmailLogsHandler];

const Services: Provider[] = [
    EmailLogProcessor,
    EmailLogQueueService,
    EmailProcessor,
    EmailProviderService,
    EmailQueueService,
    EmailRetryService,
    EmailService,
    EmailTemplateRendererService,
];

const Repositories: Provider[] = [
    {
        provide: EMAIL_LOG_REPOSITORY,
        useClass: EmailLogRepositoryImpl,
    },
];
const Exports: Provider[] = [EmailQueueService];

@Global()
@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: EMAIL_QUEUE.name,
            inject: [TypedConfigService],
            useFactory: (configService: TypedConfigService) => ({
                redis: {
                    host: configService.get('cache.host'),
                    port: configService.get('cache.port'),
                    ttl: configService.get('cache.ttl'),
                },
            }),
        }),

        BullModule.registerQueueAsync({
            name: EMAIL_LOG_QUEUE.name,
            inject: [TypedConfigService],
            useFactory: (configService: TypedConfigService) => ({
                redis: {
                    host: configService.get('cache.host'),
                    port: configService.get('cache.port'),
                    ttl: configService.get('cache.ttl'),
                },
            }),
        }),
    ],
    providers: [...Repositories, ...CommandHandlers, ...QueryHandlers, ...Services],
    exports: Exports,
})
export class AppMailerModule {}
