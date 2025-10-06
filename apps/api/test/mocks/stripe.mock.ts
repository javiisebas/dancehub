import Stripe from 'stripe';

export class StripeMock {
    static createCustomerMock(): Stripe.Customer {
        return {
            id: 'cus_test_123',
            object: 'customer',
            email: 'test@example.com',
            name: 'Test User',
            created: Date.now() / 1000,
            livemode: false,
        } as Stripe.Customer;
    }

    static createPaymentIntentMock(): Stripe.PaymentIntent {
        return {
            id: 'pi_test_123',
            object: 'payment_intent',
            amount: 2000,
            currency: 'usd',
            status: 'requires_payment_method',
            client_secret: 'pi_test_123_secret_test',
            created: Date.now() / 1000,
            livemode: false,
        } as Stripe.PaymentIntent;
    }

    static createSubscriptionMock(): Stripe.Subscription {
        const now = Date.now() / 1000;
        return {
            id: 'sub_test_123',
            object: 'subscription',
            status: 'active',
            created: now,
            current_period_start: now,
            current_period_end: now + 30 * 24 * 60 * 60,
            cancel_at_period_end: false,
            items: {
                object: 'list',
                data: [
                    {
                        id: 'si_test_123',
                        price: {
                            id: 'price_test_123',
                            product: 'prod_test_123',
                            unit_amount: 2999,
                            currency: 'usd',
                            recurring: {
                                interval: 'month',
                                interval_count: 1,
                            },
                        } as Stripe.Price,
                    } as Stripe.SubscriptionItem,
                ],
            },
        } as any as Stripe.Subscription;
    }

    static createWebhookEventMock(type: string, data: any): Stripe.Event {
        return {
            id: `evt_test_${Date.now()}`,
            object: 'event',
            type,
            data: {
                object: data,
            },
            created: Date.now() / 1000,
            livemode: false,
        } as Stripe.Event;
    }
}
