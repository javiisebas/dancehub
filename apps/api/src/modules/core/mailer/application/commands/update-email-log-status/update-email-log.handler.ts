import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { Inject, Injectable } from '@nestjs/common';
import { EmailLog } from '../../../domain/entities/email-log.entity';
import { EmailStatusEnum } from '../../../domain/enums/email-status.enum';
import { IEmailLogRepository } from '../../../domain/repositories/i-email-log.repository';
import { TOKENS } from '../../../mailer.tokens';
import { UpdateEmailLogCommand } from './update-email-log.command';

@Injectable()
export class UpdateEmailLogHandler {
    constructor(
        @Inject(TOKENS.EMAIL_LOG_REPOSITORY)
        private readonly repository: IEmailLogRepository,
    ) {}

    async execute({ data }: UpdateEmailLogCommand): Promise<EmailLog> {
        const { id, status, newAttempts, error } = data;

        const log = await this.repository.findById(id);
        if (!log) {
            throw new NotFoundException('EmailLog');
        }

        if (status === EmailStatusEnum.SENT) {
            log.markAsSent(new Date());
        } else if (status === EmailStatusEnum.FAILED && error) {
            log.markAsFailed(error);
        } else if (status === EmailStatusEnum.PENDING) {
            log.markAsPending();
        } else if (status === EmailStatusEnum.RATE_LIMITED) {
            log.markAsRateLimited();
        } else {
            log.status = status;
            if (newAttempts) {
                log.attempts++;
            }
            if (error) {
                log.error = error;
            }
        }

        return this.repository.updateEntity(log);
    }
}
