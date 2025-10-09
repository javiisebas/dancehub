import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { webhookEvents } from '../../infrastructure/schemas/webhook-event.schema';
import type { WebhookEvent } from '../entities/webhook-event.entity';

export const WEBHOOK_EVENT_REPOSITORY = Symbol('WEBHOOK_EVENT_REPOSITORY');

export type WebhookEventField = InferFields<typeof webhookEvents>;
export type WebhookEventRelations = {};

export interface IWebhookEventRepository
    extends IBaseRepository<WebhookEvent, WebhookEventField, WebhookEventRelations> {
    findByStripeEventId(stripeEventId: string): Promise<WebhookEvent | null>;
    findUnprocessed(): Promise<WebhookEvent[]>;
}
