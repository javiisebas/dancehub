import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { SubscriptionStatusEnum } from '@repo/shared';
import { subscriptions } from '../../infrastructure/schemas/subscription.schema';
import type { Subscription } from '../entities/subscription.entity';

export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');

export type SubscriptionField = InferFields<typeof subscriptions>;
export type SubscriptionRelations = {};

export interface ISubscriptionRepository
    extends IBaseRepository<Subscription, SubscriptionField, SubscriptionRelations> {
    findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null>;
    findByUserId(userId: string): Promise<Subscription[]>;
    findActiveByUserId(userId: string): Promise<Subscription | null>;
    findByStatus(status: SubscriptionStatusEnum): Promise<Subscription[]>;
}
