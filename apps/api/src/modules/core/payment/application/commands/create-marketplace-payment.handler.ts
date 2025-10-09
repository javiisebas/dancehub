import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { CreateMarketplacePaymentRequest, PaymentTypeEnum } from '@repo/shared';
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

export class CreateMarketplacePaymentCommand extends CreateCommand<CreateMarketplacePaymentRequest> {}

@Injectable()
export class CreateMarketplacePaymentHandler {
    constructor(
        @Inject(PAYMENT_INTENT_REPOSITORY)
        private readonly paymentIntentRepository: IPaymentIntentRepository,
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: ICustomerRepository,
        private readonly stripeService: StripeService,
        private readonly configService: TypedConfigService,
    ) {}

    async execute({
        data,
        userId,
    }: CreateMarketplacePaymentCommand & { userId: string }): Promise<PaymentIntent> {
        const customer = await this.customerRepository.findByUserId(userId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const platformFeePercentage =
            data.platformFeePercentage ??
            this.configService.get('payment.platformFeePercentage', 5);
        const platformFee = Math.round(data.amount * (platformFeePercentage / 100));

        const stripePaymentIntent = await this.stripeService.createPaymentIntent({
            amount: data.amount,
            currency: data.currency.toLowerCase(),
            customer: customer.stripeCustomerId,
            description: data.description,
            application_fee_amount: platformFee,
            transfer_data: {
                destination: data.connectedAccountId,
            },
            metadata: {
                userId,
                paymentType: PaymentTypeEnum.MARKETPLACE,
                platformFeePercentage: platformFeePercentage.toString(),
                ...data.metadata,
            },
        });

        const paymentIntent = PaymentIntent.create(
            userId,
            stripePaymentIntent.id,
            data.amount,
            data.currency,
            PaymentTypeEnum.MARKETPLACE,
            data.description,
            {
                ...data.metadata,
                connectedAccountId: data.connectedAccountId,
                platformFee,
                platformFeePercentage,
            },
        );

        return this.paymentIntentRepository.save(paymentIntent);
    }
}
