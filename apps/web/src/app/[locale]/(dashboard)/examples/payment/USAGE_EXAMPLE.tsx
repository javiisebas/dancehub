/**
 * COMPLETE PAYMENT INTEGRATION EXAMPLES
 *
 * This file demonstrates all payment use cases:
 * 1. One-time payments
 * 2. Subscriptions
 * 3. Marketplace payments
 * 4. Checkout sessions
 * 5. Connected accounts
 */

'use client';

import { CurrencyEnum, PaymentTypeEnum } from '@repo/shared';
import {
    CheckoutButton,
    PaymentForm,
    StripeProvider,
    useCreatePaymentIntent,
} from '@web/features/payment';

// ============================================================================
// EXAMPLE 1: Simple Checkout Button (Easiest way)
// ============================================================================

export function SimpleCheckout() {
    return (
        <CheckoutButton
            amount={5000} // $50.00 in cents
            currency="usd"
            name="Premium Dance Course"
            description="Complete course with 20 video lessons"
            mode="payment" // or "subscription"
        >
            Buy Course - $50.00
        </CheckoutButton>
    );
}

// ============================================================================
// EXAMPLE 2: Subscription with Stripe Price ID
// ============================================================================

export function SubscriptionCheckout() {
    return (
        <div className="space-y-4">
            {/* Monthly Plan */}
            <CheckoutButton
                priceId="price_1SFychBqQ0czgi0V1GfvYiV3"
                mode="subscription"
                className="w-full"
            >
                Subscribe Monthly - $19.99/mo
            </CheckoutButton>

            {/* Yearly Plan */}
            <CheckoutButton
                priceId="price_1SFychBqQ0czgi0VtU0GmDL8"
                mode="subscription"
                className="w-full"
            >
                Subscribe Yearly - $199.99/yr (Save 20%)
            </CheckoutButton>
        </div>
    );
}

// ============================================================================
// EXAMPLE 3: Custom Payment Form with Card Input
// ============================================================================

export function CustomPaymentForm() {
    const { mutate: createPayment, data: paymentIntent, isPending } = useCreatePaymentIntent();

    const handleCreatePayment = () => {
        createPayment({
            amount: 4500,
            currency: CurrencyEnum.USD,
            paymentType: PaymentTypeEnum.ONE_TIME,
            description: 'Dance Workshop Ticket',
            metadata: {
                eventId: 'workshop-123',
                userId: 'user-456',
            },
        });
    };

    return (
        <div className="space-y-4">
            {!paymentIntent && (
                <button onClick={handleCreatePayment} disabled={isPending} className="btn-primary">
                    {isPending ? 'Processing...' : 'Pay $45.00'}
                </button>
            )}

            {paymentIntent && (
                <StripeProvider>
                    <PaymentForm
                        paymentIntent={paymentIntent}
                        onSuccess={() => {
                            console.log('Payment successful!');
                            // Redirect to success page, show confirmation, etc.
                        }}
                        onError={(error) => {
                            console.error('Payment failed:', error);
                        }}
                    />
                </StripeProvider>
            )}
        </div>
    );
}

// ============================================================================
// EXAMPLE 4: Event Ticket Purchase
// ============================================================================

export function EventTicketPurchase({
    eventId,
    eventName,
    price,
}: {
    eventId: string;
    eventName: string;
    price: number;
}) {
    return (
        <CheckoutButton
            amount={price}
            currency="usd"
            name={eventName}
            description="Event ticket"
            mode="payment"
            metadata={{
                eventId,
                type: 'ticket',
            }}
            successUrl={`${window.location.origin}/events/${eventId}/success`}
            cancelUrl={`${window.location.origin}/events/${eventId}`}
        >
            Buy Ticket - ${(price / 100).toFixed(2)}
        </CheckoutButton>
    );
}

// ============================================================================
// EXAMPLE 5: Multiple Items Checkout
// ============================================================================

export function MultipleItemsCheckout() {
    const items = [
        { priceId: 'price_course1', quantity: 1 }, // Course 1
        { priceId: 'price_course2', quantity: 1 }, // Course 2
        { amount: 2000, currency: 'usd', quantity: 1, name: 'Bonus Material' }, // Custom item
    ];

    return (
        <CheckoutButton
            lineItems={items}
            mode="payment"
            successUrl="/purchase/success"
            cancelUrl="/cart"
        >
            Checkout Bundle - $149.00
        </CheckoutButton>
    );
}

// ============================================================================
// EXAMPLE 6: Conditional Payment (based on user state)
// ============================================================================

export function ConditionalPayment({ userHasSubscription }: { userHasSubscription: boolean }) {
    if (userHasSubscription) {
        return (
            <div className="alert alert-info">
                You already have an active subscription. Enjoy unlimited access!
            </div>
        );
    }

    return (
        <CheckoutButton
            priceId="price_1SFychBqQ0czgi0V1GfvYiV3"
            mode="subscription"
            metadata={{ source: 'premium-upsell' }}
        >
            Upgrade to Premium
        </CheckoutButton>
    );
}

// ============================================================================
// EXAMPLE 7: Usage in any component
// ============================================================================

export function AnywhereInYourApp() {
    return (
        <div className="card">
            <h2>Premium Feature</h2>
            <p>Unlock advanced dance techniques and exclusive content</p>

            {/* Just drop this component anywhere! */}
            <CheckoutButton amount={9900} currency="usd" name="Premium Access" mode="payment">
                Get Premium - $99.00
            </CheckoutButton>
        </div>
    );
}

// ============================================================================
// NOTES:
// ============================================================================

/**
 * AMOUNT FORMAT:
 * - Always in cents (e.g., $50.00 = 5000)
 * - Stripe requirement
 *
 * MODES:
 * - "payment" = One-time payment
 * - "subscription" = Recurring subscription
 *
 * PRICE ID vs AMOUNT:
 * - priceId: Use for products created in Stripe Dashboard
 * - amount: Use for dynamic pricing (calculated in your app)
 *
 * CALLBACKS:
 * - successUrl: Where to redirect after successful payment
 * - cancelUrl: Where to redirect if user cancels
 * - onSuccess: Callback function after payment (custom form only)
 * - onError: Handle errors (custom form only)
 *
 * METADATA:
 * - Add any custom data (orderId, userId, productId, etc.)
 * - Useful for tracking and webhooks
 * - Available in Stripe Dashboard and webhooks
 */
