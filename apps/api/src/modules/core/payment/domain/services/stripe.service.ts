import { TypedConfigService } from '@api/modules/core/config/config.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements OnModuleInit {
    private readonly logger = new Logger(StripeService.name);
    private stripe!: Stripe;

    constructor(private readonly configService: TypedConfigService) {}

    onModuleInit() {
        const secretKey = this.configService.get('payment.stripeSecretKey', '');
        const apiVersion = this.configService.get('payment.stripeApiVersion', '2024-12-18.acacia');

        if (!secretKey) {
            this.logger.warn('Stripe secret key not configured');
            return;
        }

        this.stripe = new Stripe(secretKey, {
            apiVersion: apiVersion as any,
            typescript: true,
        });

        this.logger.log('Stripe service initialized');
    }

    getClient(): Stripe {
        if (!this.stripe) {
            throw new Error('Stripe client not initialized');
        }
        return this.stripe;
    }

    async createCustomer(params: Stripe.CustomerCreateParams): Promise<Stripe.Customer> {
        return this.stripe.customers.create(params);
    }

    async getCustomer(customerId: string): Promise<Stripe.Customer> {
        return this.stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
    }

    async updateCustomer(
        customerId: string,
        params: Stripe.CustomerUpdateParams,
    ): Promise<Stripe.Customer> {
        return this.stripe.customers.update(customerId, params);
    }

    async deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
        return this.stripe.customers.del(customerId);
    }

    async createPaymentIntent(
        params: Stripe.PaymentIntentCreateParams,
    ): Promise<Stripe.PaymentIntent> {
        return this.stripe.paymentIntents.create(params);
    }

    async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        return this.stripe.paymentIntents.retrieve(paymentIntentId);
    }

    async updatePaymentIntent(
        paymentIntentId: string,
        params: Stripe.PaymentIntentUpdateParams,
    ): Promise<Stripe.PaymentIntent> {
        return this.stripe.paymentIntents.update(paymentIntentId, params);
    }

    async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        return this.stripe.paymentIntents.cancel(paymentIntentId);
    }

    async createSubscription(
        params: Stripe.SubscriptionCreateParams,
    ): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.create(params);
    }

    async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.retrieve(subscriptionId);
    }

    async updateSubscription(
        subscriptionId: string,
        params: Stripe.SubscriptionUpdateParams,
    ): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.update(subscriptionId, params);
    }

    async cancelSubscription(
        subscriptionId: string,
        atPeriodEnd: boolean = false,
    ): Promise<Stripe.Subscription> {
        if (atPeriodEnd) {
            return this.stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });
        }
        return this.stripe.subscriptions.cancel(subscriptionId);
    }

    async createCheckoutSession(
        params: Stripe.Checkout.SessionCreateParams,
    ): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.create(params);
    }

    async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }

    async createAccount(params: Stripe.AccountCreateParams): Promise<Stripe.Account> {
        return this.stripe.accounts.create(params);
    }

    async getAccount(accountId: string): Promise<Stripe.Account> {
        return this.stripe.accounts.retrieve(accountId);
    }

    async updateAccount(
        accountId: string,
        params: Stripe.AccountUpdateParams,
    ): Promise<Stripe.Account> {
        return this.stripe.accounts.update(accountId, params);
    }

    async deleteAccount(accountId: string): Promise<Stripe.DeletedAccount> {
        return this.stripe.accounts.del(accountId);
    }

    async createAccountLink(params: Stripe.AccountLinkCreateParams): Promise<Stripe.AccountLink> {
        return this.stripe.accountLinks.create(params);
    }

    async createTransfer(params: Stripe.TransferCreateParams): Promise<Stripe.Transfer> {
        return this.stripe.transfers.create(params);
    }

    async refund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
        const params: Stripe.RefundCreateParams = {
            payment_intent: paymentIntentId,
        };

        if (amount) {
            params.amount = amount;
        }

        return this.stripe.refunds.create(params);
    }

    async createPrice(params: Stripe.PriceCreateParams): Promise<Stripe.Price> {
        return this.stripe.prices.create(params);
    }

    async createProduct(params: Stripe.ProductCreateParams): Promise<Stripe.Product> {
        return this.stripe.products.create(params);
    }

    async constructWebhookEvent(
        payload: string | Buffer,
        signature: string,
        secret: string,
    ): Promise<Stripe.Event> {
        return this.stripe.webhooks.constructEvent(payload, signature, secret);
    }

    async listCustomerPaymentMethods(
        customerId: string,
        type: string = 'card',
    ): Promise<Stripe.PaymentMethod[]> {
        const paymentMethods = await this.stripe.paymentMethods.list({
            customer: customerId,
            type: type as any,
        });
        return paymentMethods.data;
    }

    async attachPaymentMethodToCustomer(
        paymentMethodId: string,
        customerId: string,
    ): Promise<Stripe.PaymentMethod> {
        return this.stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
    }

    async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
        return this.stripe.paymentMethods.detach(paymentMethodId);
    }
}
