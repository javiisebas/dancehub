import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { WebhookEvent } from '../../domain/entities/webhook-event.entity';
import { IWebhookEventRepository } from '../../domain/repositories/i-webhook-event.repository';
import { webhookEvents } from '../schemas/webhook-event.schema';

@Injectable()
export class WebhookEventRepositoryImpl
    extends BaseRepository<WebhookEvent, typeof webhookEvents>
    implements IWebhookEventRepository
{
    protected readonly table = webhookEvents;
    protected readonly entityName = 'WebhookEvent';

    protected toDomain(schema: typeof webhookEvents.$inferSelect): WebhookEvent {
        return new WebhookEvent(
            schema.id,
            schema.stripeEventId,
            schema.eventType,
            schema.data as any,
            schema.processed,
            schema.processedAt ?? null,
            schema.error ?? null,
            parseInt(schema.retryCount),
            schema.createdAt,
        );
    }

    protected toSchema(entity: WebhookEvent): any {
        return {
            stripeEventId: entity.stripeEventId,
            eventType: entity.eventType,
            data: entity.data,
            processed: entity.processed,
            ...(entity.processedAt && { processedAt: entity.processedAt }),
            ...(entity.error && { error: entity.error }),
            retryCount: entity.retryCount.toString(),
        };
    }

    async findByStripeEventId(stripeEventId: string): Promise<WebhookEvent | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.stripeEventId, stripeEventId))
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }

    async findUnprocessed(): Promise<WebhookEvent[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.processed, false));
        return results.map((r) => this.toDomain(r));
    }
}
