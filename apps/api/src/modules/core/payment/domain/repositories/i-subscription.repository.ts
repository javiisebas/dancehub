import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import { SubscriptionStatusEnum } from '@repo/shared';
import type { Subscription } from '../entities/subscription.entity';

export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');

export interface ISubscriptionRepository extends IBaseRepository<Subscription, string> {
    findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null>;
    findByUserId(userId: string): Promise<Subscription[]>;
    findActiveByUserId(userId: string): Promise<Subscription | null>;
    findByStatus(status: SubscriptionStatusEnum): Promise<Subscription[]>;
}
