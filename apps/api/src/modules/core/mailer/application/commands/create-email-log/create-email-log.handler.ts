import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmailLog } from '../../../domain/entities/email-log.entity';
import { IEmailLogRepository } from '../../../domain/repositories/i-email-log.repository';
import { TOKENS } from '../../../mailer.tokens';
import { CreateEmailLogCommand } from './create-email-log.command';

@Injectable()
export class CreateEmailLogHandler {
    constructor(
        @Inject(TOKENS.EMAIL_LOG_REPOSITORY)
        private readonly repository: IEmailLogRepository,
    ) {}

    async execute({ data }: CreateEmailLogCommand): Promise<EmailLog> {
        const emailLog = EmailLog.create(
            randomUUID(),
            data.to,
            data.subject,
            data.template,
            data.data,
        );

        return await this.repository.save(emailLog);
    }
}
