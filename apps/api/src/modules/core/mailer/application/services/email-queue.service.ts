import { EMAIL_QUEUE } from '@api/common/constants/email.constants';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { TIME_MS } from '@repo/shared';
import { Queue } from 'bull';
import { EmailLog } from '../../domain/entities/email-log.entity';
import { SendEmailJobData } from '../../infrastructure/dtos/send-email-job-data.dto';
import { SendEmailDto } from '../../infrastructure/dtos/send-email.dto';
import { CreateEmailLogCommand } from '../commands/create-email-log/create-email-log.command';
import { CreateEmailLogHandler } from '../commands/create-email-log/create-email-log.handler';

@Injectable()
export class EmailQueueService {
    constructor(
        @InjectQueue(EMAIL_QUEUE.name)
        private readonly emailQueue: Queue<SendEmailJobData>,
        private readonly createEmailLogHandler: CreateEmailLogHandler,
    ) {}

    async sendEmail(emailOptions: SendEmailDto): Promise<void> {
        const emailLog = await this.createEmailLogHandler.execute(
            new CreateEmailLogCommand({
                to: emailOptions.to,
                subject: emailOptions.subject,
                template: emailOptions.template,
                data: emailOptions.data,
            }),
        );

        await this.emailQueue.add(
            EMAIL_QUEUE.jobs.SEND_EMAIL,
            { ...emailOptions, emailLogId: emailLog.id },
            {
                attempts: EMAIL_QUEUE.attempts,
                backoff: TIME_MS.MINUTE,
                removeOnComplete: true,
                removeOnFail: false,
            },
        );
    }

    async requeueEmail(emailLog: EmailLog): Promise<void> {
        await this.emailQueue.add(
            EMAIL_QUEUE.jobs.SEND_EMAIL,
            {
                to: emailLog.to,
                subject: emailLog.subject,
                template: emailLog.template,
                data: emailLog.data,
                emailLogId: emailLog.id,
            },
            {
                attempts: EMAIL_QUEUE.attempts,
                backoff: TIME_MS.MINUTE,
                removeOnComplete: true,
                removeOnFail: false,
            },
        );
    }
}
