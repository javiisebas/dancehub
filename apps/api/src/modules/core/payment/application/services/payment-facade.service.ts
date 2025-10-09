import { Inject, Injectable } from '@nestjs/common';
import { CurrencyEnum } from '@repo/shared';
import Stripe from 'stripe';
import { ConnectedAccount } from '../../domain/entities/connected-account.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { PaymentIntent } from '../../domain/entities/payment-intent.entity';
import { Subscription } from '../../domain/entities/subscription.entity';
import {
    CONNECTED_ACCOUNT_REPOSITORY,
    IConnectedAccountRepository,
} from '../../domain/repositories/i-connected-account.repository';
import {
    CUSTOMER_REPOSITORY,
    ICustomerRepository,
} from '../../domain/repositories/i-customer.repository';
import {
    IPaymentIntentRepository,
    PAYMENT_INTENT_REPOSITORY,
} from '../../domain/repositories/i-payment-intent.repository';
import {
    ISubscriptionRepository,
    SUBSCRIPTION_REPOSITORY,
} from '../../domain/repositories/i-subscription.repository';
import { StripeService } from '../../domain/services/stripe.service';
import { EnsureCustomerHandler } from '../commands/ensure-customer.handler';

@Injectable()
export class PaymentFacadeService {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: ICustomerRepository,
        @Inject(PAYMENT_INTENT_REPOSITORY)
        private readonly paymentIntentRepository: IPaymentIntentRepository,
        @Inject(SUBSCRIPTION_REPOSITORY)
        private readonly subscriptionRepository: ISubscriptionRepository,
        @Inject(CONNECTED_ACCOUNT_REPOSITORY)
        private readonly connectedAccountRepository: IConnectedAccountRepository,
        private readonly stripeService: StripeService,
        private readonly ensureCustomerHandler: EnsureCustomerHandler,
    ) {}

    async getOrCreateCustomer(userId: string): Promise<Customer> {
        return this.ensureCustomerHandler.execute(userId);
    }

    async createSimplePayment(
        userId: string,
        amount: number,
        currency: CurrencyEnum,
        description?: string,
    ): Promise<{ paymentIntent: PaymentIntent; clientSecret: string }> {
        const customer = await this.getOrCreateCustomer(userId);

        const stripePaymentIntent = await this.stripeService.createPaymentIntent({
            amount,
            currency: currency.toLowerCase(),
            customer: customer.stripeCustomerId,
            description,
            metadata: { userId, paymentType: 'one_time' },
        });

        const paymentIntent = PaymentIntent.create(
            userId,
            stripePaymentIntent.id,
            amount,
            currency,
            'one_time' as any,
            description,
        );

        const savedPaymentIntent = await this.paymentIntentRepository.save(paymentIntent);

        return {
            paymentIntent: savedPaymentIntent,
            clientSecret: stripePaymentIntent.client_secret!,
        };
    }

    async getPaymentIntent(userId: string, paymentIntentId: string): Promise<PaymentIntent | null> {
        const paymentIntent = await this.paymentIntentRepository.findById(paymentIntentId);
        if (!paymentIntent || paymentIntent.userId !== userId) {
            return null;
        }
        return paymentIntent;
    }

    async getUserPaymentIntents(userId: string): Promise<PaymentIntent[]> {
        return this.paymentIntentRepository.findByUserId(userId);
    }

    async getActiveSubscription(userId: string): Promise<Subscription | null> {
        return this.subscriptionRepository.findActiveByUserId(userId);
    }

    async getUserSubscriptions(userId: string): Promise<Subscription[]> {
        return this.subscriptionRepository.findByUserId(userId);
    }

    async hasActiveSubscription(userId: string): Promise<boolean> {
        const subscription = await this.getActiveSubscription(userId);
        return subscription !== null && subscription.isActive();
    }

    async getConnectedAccount(userId: string): Promise<ConnectedAccount | null> {
        return this.connectedAccountRepository.findByUserId(userId);
    }

    async canAcceptPayments(userId: string): Promise<boolean> {
        const account = await this.getConnectedAccount(userId);
        return account?.canAcceptPayments() ?? false;
    }

    async refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
        const paymentIntent = await this.paymentIntentRepository.findById(paymentIntentId);
        if (!paymentIntent) {
            throw new Error('Payment intent not found');
        }

        if (!paymentIntent.canBeRefunded()) {
            throw new Error('Payment cannot be refunded');
        }

        return this.stripeService.refund(paymentIntent.stripePaymentIntentId, amount);
    }

    async createProduct(
        name: string,
        description?: string,
        metadata?: Record<string, any>,
    ): Promise<Stripe.Product> {
        return this.stripeService.createProduct({
            name,
            description,
            metadata,
        });
    }

    async createPrice(
        productId: string,
        amount: number,
        currency: CurrencyEnum,
        recurring?: {
            interval: 'day' | 'week' | 'month' | 'year';
            intervalCount?: number;
        },
    ): Promise<Stripe.Price> {
        return this.stripeService.createPrice({
            product: productId,
            unit_amount: amount,
            currency: currency.toLowerCase(),
            ...(recurring && { recurring }),
        });
    }

    async getStripeClient(): Promise<Stripe> {
        return this.stripeService.getClient();
    }
}
