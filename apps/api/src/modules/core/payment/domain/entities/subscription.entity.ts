import { BaseEntity } from '@api/common/abstract/domain';
import { CurrencyEnum, SubscriptionIntervalEnum, SubscriptionStatusEnum } from '@repo/shared';

export class Subscription extends BaseEntity {
    constructor(
        id: string,
        public userId: string,
        public stripeSubscriptionId: string,
        public stripePriceId: string,
        public stripeProductId: string,
        public status: SubscriptionStatusEnum,
        public currentPeriodStart: Date,
        public currentPeriodEnd: Date,
        public cancelAtPeriodEnd: boolean,
        public interval: SubscriptionIntervalEnum,
        public intervalCount: number,
        public amount: number,
        public currency: CurrencyEnum,
        public trialEnd: Date | null,
        public canceledAt: Date | null,
        public metadata: Record<string, any> | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    updateStatus(status: SubscriptionStatusEnum): void {
        this.status = status;
    }

    cancel(atPeriodEnd: boolean = true): void {
        if (atPeriodEnd) {
            this.cancelAtPeriodEnd = true;
        } else {
            this.status = 'canceled' as any;
            this.canceledAt = new Date();
        }
    }

    isActive(): boolean {
        return this.status === SubscriptionStatusEnum.ACTIVE;
    }

    isCanceled(): boolean {
        return this.status === SubscriptionStatusEnum.CANCELED;
    }

    isTrialing(): boolean {
        return this.status === SubscriptionStatusEnum.TRIALING;
    }

    willCancelAtPeriodEnd(): boolean {
        return this.cancelAtPeriodEnd;
    }

    static create(
        userId: string,
        stripeSubscriptionId: string,
        stripePriceId: string,
        stripeProductId: string,
        currentPeriodStart: Date,
        currentPeriodEnd: Date,
        interval: SubscriptionIntervalEnum,
        intervalCount: number,
        amount: number,
        currency: CurrencyEnum,
        trialEnd?: Date,
        metadata?: Record<string, any>,
    ): Subscription {
        const now = new Date();
        return new Subscription(
            crypto.randomUUID(),
            userId,
            stripeSubscriptionId,
            stripePriceId,
            stripeProductId,
            SubscriptionStatusEnum.INCOMPLETE,
            currentPeriodStart,
            currentPeriodEnd,
            false,
            interval,
            intervalCount,
            amount,
            currency,
            trialEnd ?? null,
            null,
            metadata ?? null,
            now,
            now,
        );
    }
}
