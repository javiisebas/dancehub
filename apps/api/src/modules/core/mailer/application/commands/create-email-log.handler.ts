import { Command } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmailLog } from '../../domain/entities/email-log.entity';
import { EmailTemplateEnum } from '../../domain/enums/email-templates.enum';
import {
    EMAIL_LOG_REPOSITORY,
    IEmailLogRepository,
} from '../../domain/repositories/i-email-log.repository';

export interface CreateEmailLogCommandInput {
    to: string;
    subject: string;
    template: EmailTemplateEnum;
    data: any;
}

export class CreateEmailLogCommand extends Command<CreateEmailLogCommandInput> {}

@Injectable()
export class CreateEmailLogHandler {
    constructor(
        @Inject(EMAIL_LOG_REPOSITORY)
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
