import { BaseEntity } from '@api/common/abstract/domain';
import { EmailStatusEnum } from '../enums/email-status.enum';
import { EmailTemplateEnum } from '../enums/email-templates.enum';

export class EmailLog extends BaseEntity {
    constructor(
        id: string,
        public to: string,
        public subject: string,
        public template: EmailTemplateEnum,
        public data: any,
        public status: EmailStatusEnum,
        public attempts: number,
        public error: string | null,
        public sentAt: Date | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    markAsSent(sentAt: Date): void {
        this.status = EmailStatusEnum.SENT;
        this.sentAt = sentAt;
    }

    markAsFailed(error: string): void {
        this.status = EmailStatusEnum.FAILED;
        this.error = error;
        this.attempts++;
    }

    markAsPending(): void {
        this.status = EmailStatusEnum.PENDING;
    }

    markAsRateLimited(): void {
        this.status = EmailStatusEnum.RATE_LIMITED;
    }

    canRetry(maxAttempts: number): boolean {
        return this.attempts < maxAttempts;
    }

    static create(
        id: string,
        to: string,
        subject: string,
        template: EmailTemplateEnum,
        data: any,
    ): EmailLog {
        const now = new Date();
        return new EmailLog(
            id,
            to,
            subject,
            template,
            data,
            EmailStatusEnum.TO_BE_SENT,
            0,
            null,
            null,
            now,
            now,
        );
    }
}
