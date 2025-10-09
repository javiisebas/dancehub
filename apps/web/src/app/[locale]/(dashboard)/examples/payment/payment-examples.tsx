'use client';

import { Card } from '@repo/ui/components';
import { CurrencyEnum, PaymentTypeEnum } from '@repo/shared';
import { useState } from 'react';
import {
    CheckoutButton,
    ConnectedAccountSetup,
    PaymentForm,
    StripeProvider,
    SubscriptionManager,
    useCreatePaymentIntent,
} from '@web/features/payment';

export function PaymentExamples() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Payment Integration Examples</h1>
                <p className="text-muted-foreground">
                    Complete examples showing all payment use cases
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <OneTimePaymentExample />
                <SubscriptionExample />
                <CheckoutSessionExample />
                <MarketplaceExample />
            </div>
        </div>
    );
}

function OneTimePaymentExample() {
    const { mutate: createPaymentIntent, data: paymentIntent } = useCreatePaymentIntent();
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const handleCreatePayment = () => {
        createPaymentIntent(
            {
                amount: 5000,
                currency: CurrencyEnum.USD,
                paymentType: PaymentTypeEnum.ONE_TIME,
                description: 'Example one-time payment',
            },
            {
                onSuccess: () => {
                    setShowPaymentForm(true);
                },
            },
        );
    };

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">One-Time Payment</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Process a single payment with custom amount
            </p>

            {!showPaymentForm ? (
                <button
                    onClick={handleCreatePayment}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                    Pay $50.00
                </button>
            ) : (
                paymentIntent && (
                    <StripeProvider>
                        <PaymentForm
                            paymentIntent={paymentIntent}
                            onSuccess={() => {
                                setShowPaymentForm(false);
                                alert('Payment successful!');
                            }}
                        />
                    </StripeProvider>
                )
            )}
        </Card>
    );
}

function SubscriptionExample() {
    const mockSubscription = {
        id: 'sub_123',
        userId: 'user_123',
        stripeSubscriptionId: 'sub_stripe_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        status: 'active' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        interval: 'month' as any,
        intervalCount: 1,
        amount: 2000,
        currency: CurrencyEnum.USD,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Management</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Manage recurring subscriptions
            </p>
            <SubscriptionManager subscription={mockSubscription} />
        </Card>
    );
}

function CheckoutSessionExample() {
    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Checkout Session</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Redirect to Stripe Checkout for hosted payment page
            </p>

            <div className="space-y-3">
                <CheckoutButton
                    amount={3000}
                    currency="usd"
                    name="Premium Plan"
                    description="Monthly subscription"
                    mode="payment"
                    className="w-full"
                >
                    Buy Now - $30.00
                </CheckoutButton>

                <CheckoutButton
                    priceId="price_example"
                    mode="subscription"
                    className="w-full"
                >
                    Subscribe Monthly
                </CheckoutButton>
            </div>
        </Card>
    );
}

function MarketplaceExample() {
    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Marketplace Integration</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Setup connected account to receive payments
            </p>
            <ConnectedAccountSetup
                onSuccess={() => {
                    alert('Account setup initiated!');
                }}
            />
        </Card>
    );
}

