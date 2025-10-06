import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import type { WebhookEvent } from '../entities/webhook-event.entity';

export const WEBHOOK_EVENT_REPOSITORY = Symbol('WEBHOOK_EVENT_REPOSITORY');

export interface IWebhookEventRepository extends IBaseRepository<WebhookEvent, string> {
    findByStripeEventId(stripeEventId: string): Promise<WebhookEvent | null>;
    findUnprocessed(): Promise<WebhookEvent[]>;
}
