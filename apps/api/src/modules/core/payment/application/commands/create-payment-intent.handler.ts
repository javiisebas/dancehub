import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentIntentRequest } from '@repo/shared';
import { PaymentIntent } from '../../domain/entities/payment-intent.entity';
import {
    CUSTOMER_REPOSITORY,
    ICustomerRepository,
} from '../../domain/repositories/i-customer.repository';
import {
    IPaymentIntentRepository,
    PAYMENT_INTENT_REPOSITORY,
} from '../../domain/repositories/i-payment-intent.repository';
import { StripeService } from '../../domain/services/stripe.service';

export class CreatePaymentIntentCommand extends CreateCommand<CreatePaymentIntentRequest> {}

@Injectable()
export class CreatePaymentIntentHandler {
    constructor(
        @Inject(PAYMENT_INTENT_REPOSITORY)
        private readonly paymentIntentRepository: IPaymentIntentRepository,
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: ICustomerRepository,
        private readonly stripeService: StripeService,
    ) {}

    async execute({
        data,
        userId,
    }: CreatePaymentIntentCommand & { userId: string }): Promise<PaymentIntent> {
        const customer = await this.customerRepository.findByUserId(userId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const stripePaymentIntent = await this.stripeService.createPaymentIntent({
            amount: data.amount,
            currency: data.currency.toLowerCase(),
            customer: customer.stripeCustomerId,
            description: data.description,
            metadata: {
                userId,
                paymentType: data.paymentType,
                ...data.metadata,
            },
        });

        const paymentIntent = PaymentIntent.create(
            userId,
            stripePaymentIntent.id,
            data.amount,
            data.currency,
            data.paymentType,
            data.description,
            data.metadata,
        );

        return this.paymentIntentRepository.save(paymentIntent);
    }
}
