import { CurrencyEnum } from '../../../enums/currency.enum';
import { SubscriptionIntervalEnum } from '../../../enums/subscription-interval.enum';
import { SubscriptionStatusEnum } from '../../../enums/subscription-status.enum';

export class SubscriptionResponse {
    id!: string;
    userId!: string;
    stripeSubscriptionId!: string;
    stripePriceId!: string;
    stripeProductId!: string;
    status!: SubscriptionStatusEnum;
    currentPeriodStart!: Date;
    currentPeriodEnd!: Date;
    cancelAtPeriodEnd!: boolean;
    interval!: SubscriptionIntervalEnum;
    intervalCount!: number;
    amount!: number;
    currency!: CurrencyEnum;
    trialEnd?: Date;
    canceledAt?: Date;
    metadata?: Record<string, any>;
    createdAt!: Date;
    updatedAt!: Date;
}
