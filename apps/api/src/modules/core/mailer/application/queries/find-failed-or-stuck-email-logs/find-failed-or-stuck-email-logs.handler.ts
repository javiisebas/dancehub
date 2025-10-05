import { Inject, Injectable } from '@nestjs/common';
import { TIME_MS } from '@repo/shared';
import { EmailLog } from '../../../domain/entities/email-log.entity';
import { IEmailLogRepository } from '../../../domain/repositories/i-email-log.repository';
import { TOKENS } from '../../../mailer.tokens';
import { FindFailedOrStuckEmailLogsQuery } from './find-failed-or-stuck-email-logs.query';

@Injectable()
export class FindFailedOrStuckEmailLogsHandler {
    constructor(
        @Inject(TOKENS.EMAIL_LOG_REPOSITORY)
        private readonly repository: IEmailLogRepository,
    ) {}

    async execute(_query: FindFailedOrStuckEmailLogsQuery): Promise<EmailLog[]> {
        return await this.repository.findFailedOrStuckEmails(TIME_MS.HOUR);
    }
}
