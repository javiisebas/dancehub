import { BaseEntity } from '@api/common/abstract/domain';

export class WebhookEvent extends BaseEntity {
    constructor(
        id: string,
        public stripeEventId: string,
        public eventType: string,
        public data: Record<string, any>,
        public processed: boolean,
        public processedAt: Date | null,
        public error: string | null,
        public retryCount: number,
        createdAt: Date,
    ) {
        super(id, createdAt, createdAt);
    }

    markAsProcessed(): void {
        this.processed = true;
        this.processedAt = new Date();
    }

    markAsFailed(error: string): void {
        this.error = error;
        this.retryCount += 1;
    }

    canRetry(): boolean {
        return this.retryCount < 5;
    }

    static create(
        stripeEventId: string,
        eventType: string,
        data: Record<string, any>,
    ): WebhookEvent {
        const now = new Date();
        return new WebhookEvent(
            crypto.randomUUID(),
            stripeEventId,
            eventType,
            data,
            false,
            null,
            null,
            0,
            now,
        );
    }
}
