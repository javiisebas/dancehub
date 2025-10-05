import { EMAIL_LOG_QUEUE } from '@api/common/constants/email-log.constants';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailLog } from '../../domain/entities/email-log.entity';
import {
    UpdateEmailLogCommand,
    UpdateEmailLogCommandInput,
} from '../commands/update-email-log-status/update-email-log.command';
import { UpdateEmailLogHandler } from '../commands/update-email-log-status/update-email-log.handler';

@Processor(EMAIL_LOG_QUEUE.name)
export class EmailLogProcessor {
    constructor(private readonly updateEmailLogHandler: UpdateEmailLogHandler) {}

    @Process(EMAIL_LOG_QUEUE.jobs.UPDATE_EMAIL_LOG)
    async handleUpdateEmailLog(job: Job<UpdateEmailLogCommandInput>): Promise<EmailLog> {
        return await this.updateEmailLogHandler.execute(new UpdateEmailLogCommand(job.data));
    }
}
