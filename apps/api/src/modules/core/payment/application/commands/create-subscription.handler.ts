import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionRequest } from '@repo/shared';
import { Subscription } from '../../domain/entities/subscription.entity';
import {
    CUSTOMER_REPOSITORY,
    ICustomerRepository,
} from '../../domain/repositories/i-customer.repository';
import {
    ISubscriptionRepository,
    SUBSCRIPTION_REPOSITORY,
} from '../../domain/repositories/i-subscription.repository';
import { StripeService } from '../../domain/services/stripe.service';

export class CreateSubscriptionCommand extends CreateCommand<CreateSubscriptionRequest> {}

@Injectable()
export class CreateSubscriptionHandler {
    constructor(
        @Inject(SUBSCRIPTION_REPOSITORY)
        private readonly subscriptionRepository: ISubscriptionRepository,
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: ICustomerRepository,
        private readonly stripeService: StripeService,
    ) {}

    async execute({
        data,
        userId,
    }: CreateSubscriptionCommand & { userId: string }): Promise<Subscription> {
        const customer = await this.customerRepository.findByUserId(userId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const stripeSubscription = await this.stripeService.createSubscription({
            customer: customer.stripeCustomerId,
            items: [{ price: data.priceId }],
            ...(data.couponId && { coupon: data.couponId }),
            metadata: {
                userId,
                ...data.metadata,
            },
        });

        const price = await this.stripeService.getClient().prices.retrieve(data.priceId);

        const subscription = Subscription.create(
            userId,
            stripeSubscription.id,
            data.priceId,
            stripeSubscription.items.data[0].price.product as string,
            new Date((stripeSubscription as any).current_period_start * 1000),
            new Date((stripeSubscription as any).current_period_end * 1000),
            price.recurring!.interval as any,
            price.recurring!.interval_count,
            price.unit_amount!,
            price.currency as any,
            stripeSubscription.trial_end
                ? new Date(stripeSubscription.trial_end * 1000)
                : undefined,
            data.metadata,
        );

        return this.subscriptionRepository.save(subscription);
    }
}
