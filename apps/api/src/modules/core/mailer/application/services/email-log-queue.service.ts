import { EMAIL_LOG_QUEUE } from '@api/common/constants/email-log.constants';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UpdateEmailLogCommandInput } from '../commands/update-email-log.handler';

@Injectable()
export class EmailLogQueueService {
    constructor(
        @InjectQueue(EMAIL_LOG_QUEUE.name)
        private readonly logQueue: Queue<UpdateEmailLogCommandInput>,
    ) {}

    async updateEmailLog(command: UpdateEmailLogCommandInput): Promise<void> {
        await this.logQueue.add(EMAIL_LOG_QUEUE.jobs.UPDATE_EMAIL_LOG, command, {
            attempts: 3,
            backoff: 5000,
            removeOnComplete: true,
            removeOnFail: false,
        });
    }
}
