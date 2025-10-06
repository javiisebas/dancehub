import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { SubscriptionStatusEnum } from '@repo/shared';
import { and, eq } from 'drizzle-orm';
import { Subscription } from '../../domain/entities/subscription.entity';
import { ISubscriptionRepository } from '../../domain/repositories/i-subscription.repository';
import { subscriptions } from '../schemas/subscription.schema';

@Injectable()
export class SubscriptionRepositoryImpl
    extends BaseRepository<Subscription, typeof subscriptions, string>
    implements ISubscriptionRepository
{
    protected table = subscriptions;
    protected entityName = 'Subscription';

    protected toDomain(schema: typeof subscriptions.$inferSelect): Subscription {
        return new Subscription(
            schema.id,
            schema.userId,
            schema.stripeSubscriptionId,
            schema.stripePriceId,
            schema.stripeProductId,
            schema.status as any,
            schema.currentPeriodStart,
            schema.currentPeriodEnd,
            schema.cancelAtPeriodEnd,
            schema.interval as any,
            schema.intervalCount,
            schema.amount,
            schema.currency as any,
            schema.trialEnd ?? null,
            schema.canceledAt ?? null,
            (schema.metadata as any) ?? null,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Subscription): any {
        return {
            userId: entity.userId,
            stripeSubscriptionId: entity.stripeSubscriptionId,
            stripePriceId: entity.stripePriceId,
            stripeProductId: entity.stripeProductId,
            status: entity.status,
            currentPeriodStart: entity.currentPeriodStart,
            currentPeriodEnd: entity.currentPeriodEnd,
            cancelAtPeriodEnd: entity.cancelAtPeriodEnd,
            interval: entity.interval,
            intervalCount: entity.intervalCount,
            amount: entity.amount,
            currency: entity.currency,
            ...(entity.trialEnd && { trialEnd: entity.trialEnd }),
            ...(entity.canceledAt && { canceledAt: entity.canceledAt }),
            ...(entity.metadata && { metadata: entity.metadata }),
        };
    }

    async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.stripeSubscriptionId, stripeSubscriptionId))
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }

    async findByUserId(userId: string): Promise<Subscription[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.userId, userId));
        return results.map((r) => this.toDomain(r));
    }

    async findActiveByUserId(userId: string): Promise<Subscription | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(
                and(
                    eq(this.table.userId, userId),
                    eq(this.table.status, SubscriptionStatusEnum.ACTIVE),
                ),
            )
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }

    async findByStatus(status: SubscriptionStatusEnum): Promise<Subscription[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.status, status));
        return results.map((r) => this.toDomain(r));
    }
}
