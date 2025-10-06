import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TIME_MS } from '@repo/shared';
import { EmailStatusEnum } from '../../domain/enums/email-status.enum';
import {
    FindFailedOrStuckEmailLogsHandler,
    FindFailedOrStuckEmailLogsQuery,
} from '../queries/find-failed-or-stuck-email-logs.handler';
import { EmailQueueService } from './email-queue.service';

@Injectable()
export class EmailRetryService {
    private readonly COOLDOWN_PERIOD = TIME_MS.HOUR;

    constructor(
        private readonly findFailedEmailsHandler: FindFailedOrStuckEmailLogsHandler,
        private readonly emailQueueService: EmailQueueService,
        private readonly logger: LogService,
    ) {}

    @Cron('0 */15 * * * *')
    async handleRetryEmails() {
        this.logger.debug('Executing email retry');

        try {
            const failedEmails = await this.findFailedEmailsHandler.execute(
                new FindFailedOrStuckEmailLogsQuery(),
            );

            if (failedEmails.length === 0) {
                this.logger.debug('No emails to retry');
                return;
            }

            this.logger.debug(`Found ${failedEmails.length} emails to retry`);

            for (const email of failedEmails) {
                const maxAttempts = 5;
                if (email.status === EmailStatusEnum.RATE_LIMITED || email.canRetry(maxAttempts)) {
                    await this.emailQueueService.requeueEmail(email);
                    this.logger.debug(`Requeued email ${email.id}`);
                } else {
                    this.logger.warn(`Email ${email.id} has reached max retry attempts`);
                }
            }

            this.logger.debug(`Requeued ${failedEmails.length} emails`);
        } catch (error: any) {
            this.logger.error('Error retrying emails', error);
        }
    }
}
