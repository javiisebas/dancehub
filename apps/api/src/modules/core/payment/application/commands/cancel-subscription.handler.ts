import { Inject, Injectable } from '@nestjs/common';
import { Subscription } from '../../domain/entities/subscription.entity';
import {
    ISubscriptionRepository,
    SUBSCRIPTION_REPOSITORY,
} from '../../domain/repositories/i-subscription.repository';
import { StripeService } from '../../domain/services/stripe.service';

@Injectable()
export class CancelSubscriptionHandler {
    constructor(
        @Inject(SUBSCRIPTION_REPOSITORY)
        private readonly subscriptionRepository: ISubscriptionRepository,
        private readonly stripeService: StripeService,
    ) {}

    async execute(subscriptionId: string, atPeriodEnd: boolean = true): Promise<Subscription> {
        const subscription = await this.subscriptionRepository.findById(subscriptionId);
        if (!subscription) {
            throw new Error('Subscription not found');
        }

        await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId, atPeriodEnd);

        subscription.cancel(atPeriodEnd);

        return this.subscriptionRepository.update(subscriptionId, subscription);
    }
}
