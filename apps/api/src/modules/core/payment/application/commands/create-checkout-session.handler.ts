import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCheckoutSessionRequest, PaymentTypeEnum } from '@repo/shared';
import Stripe from 'stripe';
import {
    CUSTOMER_REPOSITORY,
    ICustomerRepository,
} from '../../domain/repositories/i-customer.repository';
import { StripeService } from '../../domain/services/stripe.service';

export class CreateCheckoutSessionCommand extends CreateCommand<CreateCheckoutSessionRequest> {}

@Injectable()
export class CreateCheckoutSessionHandler {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: ICustomerRepository,
        private readonly stripeService: StripeService,
    ) {}

    async execute({ data, userId }: CreateCheckoutSessionCommand & { userId: string }): Promise<{
        sessionId: string;
        url: string;
    }> {
        const customer = await this.customerRepository.findByUserId(userId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = data.lineItems.map(
            (item) => {
                if (item.priceId) {
                    return {
                        price: item.priceId,
                        quantity: item.quantity,
                    };
                }

                return {
                    price_data: {
                        currency: item.currency!,
                        unit_amount: item.amount!,
                        product_data: {
                            name: item.name!,
                            description: item.description,
                        },
                    },
                    quantity: item.quantity,
                };
            },
        );

        const mode: Stripe.Checkout.SessionCreateParams.Mode =
            data.mode === PaymentTypeEnum.SUBSCRIPTION ? 'subscription' : 'payment';

        const session = await this.stripeService.createCheckoutSession({
            customer: customer.stripeCustomerId,
            mode,
            line_items: lineItems,
            success_url: data.successUrl,
            cancel_url: data.cancelUrl,
            metadata: {
                userId,
                ...data.metadata,
            },
        });

        return {
            sessionId: session.id,
            url: session.url!,
        };
    }
}
