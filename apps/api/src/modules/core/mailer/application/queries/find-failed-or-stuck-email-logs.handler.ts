import { Inject, Injectable } from '@nestjs/common';
import { TIME_MS } from '@repo/shared';
import { EmailLog } from '../../domain/entities/email-log.entity';
import {
    EMAIL_LOG_REPOSITORY,
    IEmailLogRepository,
} from '../../domain/repositories/i-email-log.repository';

export class FindFailedOrStuckEmailLogsQuery {}

@Injectable()
export class FindFailedOrStuckEmailLogsHandler {
    constructor(
        @Inject(EMAIL_LOG_REPOSITORY)
        private readonly repository: IEmailLogRepository,
    ) {}

    async execute(_query: FindFailedOrStuckEmailLogsQuery): Promise<EmailLog[]> {
        return await this.repository.findFailedOrStuckEmails(TIME_MS.HOUR);
    }
}
