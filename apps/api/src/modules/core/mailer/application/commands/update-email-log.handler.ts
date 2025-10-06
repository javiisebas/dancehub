import { Command } from '@api/common/abstract/application';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { Inject, Injectable } from '@nestjs/common';
import { EmailLog } from '../../domain/entities/email-log.entity';
import { EmailStatusEnum } from '../../domain/enums/email-status.enum';
import {
    EMAIL_LOG_REPOSITORY,
    IEmailLogRepository,
} from '../../domain/repositories/i-email-log.repository';

export interface UpdateEmailLogCommandInput {
    id: string;
    status: EmailStatusEnum;
    error?: string;
    newAttempts?: boolean;
}

export class UpdateEmailLogCommand extends Command<UpdateEmailLogCommandInput> {}

@Injectable()
export class UpdateEmailLogHandler {
    constructor(
        @Inject(EMAIL_LOG_REPOSITORY)
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
