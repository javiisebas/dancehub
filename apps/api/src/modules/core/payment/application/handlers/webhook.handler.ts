import { Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { WebhookEvent } from '../../domain/entities/webhook-event.entity';
import {
    CONNECTED_ACCOUNT_REPOSITORY,
    IConnectedAccountRepository,
} from '../../domain/repositories/i-connected-account.repository';
import {
    IPaymentIntentRepository,
    PAYMENT_INTENT_REPOSITORY,
} from '../../domain/repositories/i-payment-intent.repository';
import {
    ISubscriptionRepository,
    SUBSCRIPTION_REPOSITORY,
} from '../../domain/repositories/i-subscription.repository';
import {
    IWebhookEventRepository,
    WEBHOOK_EVENT_REPOSITORY,
} from '../../domain/repositories/i-webhook-event.repository';
import { StripeService } from '../../domain/services/stripe.service';

@Injectable()
export class WebhookHandler {
    private readonly logger = new Logger(WebhookHandler.name);

    constructor(
        @Inject(WEBHOOK_EVENT_REPOSITORY)
        private readonly webhookEventRepository: IWebhookEventRepository,
        @Inject(PAYMENT_INTENT_REPOSITORY)
        private readonly paymentIntentRepository: IPaymentIntentRepository,
        @Inject(SUBSCRIPTION_REPOSITORY)
        private readonly subscriptionRepository: ISubscriptionRepository,
        @Inject(CONNECTED_ACCOUNT_REPOSITORY)
        private readonly connectedAccountRepository: IConnectedAccountRepository,
        private readonly stripeService: StripeService,
    ) {}

    async handleWebhook(rawBody: Buffer, signature: string, webhookSecret: string): Promise<void> {
        let event: Stripe.Event;

        try {
            event = await this.stripeService.constructWebhookEvent(
                rawBody,
                signature,
                webhookSecret,
            );
        } catch (err: any) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error('Invalid signature');
        }

        const existingEvent = await this.webhookEventRepository.findByStripeEventId(event.id);
        if (existingEvent) {
            this.logger.log(`Event ${event.id} already processed`);
            return;
        }

        const webhookEvent = WebhookEvent.create(event.id, event.type, event.data as any);
        await this.webhookEventRepository.save(webhookEvent);

        try {
            await this.processEvent(event);
            webhookEvent.markAsProcessed();
            await this.webhookEventRepository.update(webhookEvent.id, webhookEvent);
        } catch (error: any) {
            this.logger.error(`Error processing webhook event ${event.id}: ${error.message}`);
            webhookEvent.markAsFailed(error.message);
            await this.webhookEventRepository.update(webhookEvent.id, webhookEvent);
            throw error;
        }
    }

    private async processEvent(event: Stripe.Event): Promise<void> {
        this.logger.log(`Processing event: ${event.type}`);

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.payment_failed':
                await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.canceled':
                await this.handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case 'invoice.paid':
                await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            case 'account.updated':
                await this.handleAccountUpdated(event.data.object as Stripe.Account);
                break;

            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }
    }

    private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await this.paymentIntentRepository.findByStripePaymentIntentId(
            paymentIntent.id,
        );
        if (payment) {
            payment.updateStatus('succeeded' as any);
            await this.paymentIntentRepository.update(payment.id, payment);
        }
    }

    private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await this.paymentIntentRepository.findByStripePaymentIntentId(
            paymentIntent.id,
        );
        if (payment) {
            payment.updateStatus('failed' as any);
            await this.paymentIntentRepository.update(payment.id, payment);
        }
    }

    private async handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await this.paymentIntentRepository.findByStripePaymentIntentId(
            paymentIntent.id,
        );
        if (payment) {
            payment.updateStatus('canceled' as any);
            await this.paymentIntentRepository.update(payment.id, payment);
        }
    }

    private async handleSubscriptionUpdated(
        stripeSubscription: Stripe.Subscription,
    ): Promise<void> {
        const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
            stripeSubscription.id,
        );
        if (subscription) {
            subscription.updateStatus(stripeSubscription.status as any);
            subscription.currentPeriodStart = new Date(
                (stripeSubscription as any).current_period_start * 1000,
            );
            subscription.currentPeriodEnd = new Date(
                (stripeSubscription as any).current_period_end * 1000,
            );
            subscription.cancelAtPeriodEnd = (stripeSubscription as any).cancel_at_period_end;
            if ((stripeSubscription as any).canceled_at) {
                subscription.canceledAt = new Date((stripeSubscription as any).canceled_at * 1000);
            }
            await this.subscriptionRepository.update(subscription.id, subscription);
        }
    }

    private async handleSubscriptionDeleted(
        stripeSubscription: Stripe.Subscription,
    ): Promise<void> {
        const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
            stripeSubscription.id,
        );
        if (subscription) {
            subscription.updateStatus('canceled' as any);
            subscription.canceledAt = new Date();
            await this.subscriptionRepository.update(subscription.id, subscription);
        }
    }

    private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
        if (!(invoice as any).subscription) {
            return;
        }

        const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
            (invoice as any).subscription as string,
        );
        if (subscription) {
            subscription.updateStatus('active' as any);
            await this.subscriptionRepository.update(subscription.id, subscription);
        }
    }

    private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
        if (!(invoice as any).subscription) {
            return;
        }

        const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(
            (invoice as any).subscription as string,
        );
        if (subscription) {
            subscription.updateStatus('past_due' as any);
            await this.subscriptionRepository.update(subscription.id, subscription);
        }
    }

    private async handleAccountUpdated(account: Stripe.Account): Promise<void> {
        const connectedAccount = await this.connectedAccountRepository.findByStripeAccountId(
            account.id,
        );
        if (connectedAccount) {
            connectedAccount.updateCapabilities(
                account.charges_enabled || false,
                account.payouts_enabled || false,
                account.details_submitted || false,
            );
            await this.connectedAccountRepository.update(connectedAccount.id, connectedAccount);
        }
    }
}
