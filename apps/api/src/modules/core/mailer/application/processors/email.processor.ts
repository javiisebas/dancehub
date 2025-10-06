import { EMAIL_QUEUE } from '@api/common/constants/email.constants';
import { Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailStatusEnum } from '../../domain/enums/email-status.enum';
import { SendEmailJobData } from '../../infrastructure/dtos/send-email-job-data.dto';
import { EmailLogQueueService } from '../services/email-log-queue.service';
import { EmailService } from '../services/email.service';

// @Processor(EMAIL_QUEUE.name)
export class EmailProcessor {
    constructor(
        private readonly emailService: EmailService,
        private readonly emailLogQueueService: EmailLogQueueService,
    ) {}

    @Process(EMAIL_QUEUE.jobs.SEND_EMAIL)
    async handleSendEmail(job: Job<SendEmailJobData>): Promise<any> {
        const { emailLogId } = job.data;
        try {
            if (emailLogId) {
                await this.emailLogQueueService.updateEmailLog({
                    id: emailLogId,
                    status: EmailStatusEnum.PENDING,
                    newAttempts: true,
                });
            }
            const result = await this.emailService.sendEmail(job.data);
            if (emailLogId) {
                await this.emailLogQueueService.updateEmailLog({
                    id: emailLogId,
                    status: EmailStatusEnum.SENT,
                });
            }
            return result;
        } catch (error) {
            if (emailLogId) {
                const errorMessage =
                    error instanceof Error ? error.message.toLowerCase() : String(error);
                const isRateLimitError =
                    errorMessage.includes('rate limit') ||
                    errorMessage.includes('quota exceeded') ||
                    errorMessage.includes('too many');

                await this.emailLogQueueService.updateEmailLog({
                    id: emailLogId,
                    status: isRateLimitError
                        ? EmailStatusEnum.RATE_LIMITED
                        : EmailStatusEnum.FAILED,
                    error: error instanceof Error ? error.message : String(error),
                });
            }
            throw error;
        }
    }
}
