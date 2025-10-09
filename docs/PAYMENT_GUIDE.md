# Payment Integration Guide

Complete guide for testing and using the payment system.

## Quick Start

### Prerequisites

-   API running on `http://localhost:4000`
-   Stripe credentials configured in `.env`
-   Test user account created

### Test Products

The following test products are available in your Stripe account:

```bash
# One-time payments
COURSE_PRICE_ID="price_1SFycgBqQ0czgi0Vu9bvUbVg"  # $99.00
TICKET_PRICE_ID="price_1SFyciBqQ0czgi0V73ycqWiJ"  # $45.00

# Subscriptions
MONTHLY_PRICE_ID="price_1SFychBqQ0czgi0V1GfvYiV3"  # $19.99/month
YEARLY_PRICE_ID="price_1SFychBqQ0czgi0VtU0GmDL8"   # $199.99/year
```

### Run Integration Tests

```bash
cd apps/api
npx tsx scripts/test-payment-integration.ts
```

## Usage in Web App

### One-Time Payment

```tsx
import { CheckoutButton } from '@web/features/payment';

<CheckoutButton amount={5000} currency="usd" name="Premium Course" mode="payment">
    Buy Now - $50.00
</CheckoutButton>;
```

### Subscription

```tsx
import { CheckoutButton } from '@web/features/payment';

<CheckoutButton priceId="price_1SFychBqQ0czgi0V1GfvYiV3" mode="subscription">
    Subscribe Monthly - $19.99
</CheckoutButton>;
```

### Custom Payment Form

```tsx
import { StripeProvider, PaymentForm, useCreatePaymentIntent } from '@web/features/payment';

function MyPayment() {
    const { mutate, data } = useCreatePaymentIntent();

    const handlePay = () => {
        mutate({
            amount: 5000,
            currency: 'usd',
            paymentType: 'one_time',
        });
    };

    return (
        <>
            <button onClick={handlePay}>Create Payment</button>
            {data && (
                <StripeProvider>
                    <PaymentForm
                        paymentIntent={data}
                        onSuccess={() => alert('Payment successful!')}
                    />
                </StripeProvider>
            )}
        </>
    );
}
```

### Marketplace (Connected Accounts)

```tsx
import { ConnectedAccountSetup } from '@web/features/payment';

<ConnectedAccountSetup onSuccess={() => console.log('Account created!')} />;
```

## API Endpoints

### POST `/api/payment/intent`

Create a one-time payment intent

**Body:**

```json
{
    "amount": 5000,
    "currency": "usd",
    "paymentType": "one_time",
    "description": "Payment description",
    "metadata": {}
}
```

### POST `/api/payment/subscription`

Create a subscription

**Body:**

```json
{
    "priceId": "price_xxx",
    "metadata": {}
}
```

### POST `/api/payment/checkout`

Create a checkout session

**Body:**

```json
{
    "lineItems": [
        {
            "priceId": "price_xxx",
            "quantity": 1
        }
    ],
    "mode": "subscription",
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
}
```

### POST `/api/payment/connect/account`

Create a connected account for marketplace

**Body:**

```json
{
    "businessName": "My Business",
    "email": "business@example.com",
    "country": "US",
    "businessType": "individual"
}
```

### POST `/api/payment/marketplace`

Create a marketplace payment (splits payment)

**Body:**

```json
{
    "amount": 10000,
    "currency": "usd",
    "connectedAccountId": "acct_xxx",
    "platformFeePercentage": 5,
    "description": "Marketplace payment"
}
```

## Testing Webhooks

Use Stripe CLI to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:4000/api/payment/webhook

# In another terminal, trigger test events:
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

## Environment Variables

### API (.env)

```bash
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PLATFORM_FEE_PERCENTAGE=5
```

### Web App (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## Database Tables

The payment module automatically creates these tables:

-   `customers` - Stripe customer records
-   `payment_intents` - Payment records
-   `subscriptions` - Subscription records
-   `connected_accounts` - Marketplace seller accounts
-   `webhook_events` - Stripe webhook event log

## Use Cases Covered

-   **One-Time Payments** - Single purchases, event tickets, courses
-   **Subscriptions** - Monthly/yearly recurring payments
-   **Marketplace** - Platform connects buyers and sellers
-   **Checkout Sessions** - Hosted Stripe checkout page
-   **Webhook Handling** - Automatic payment status updates

## Example Flow

1. User clicks "Subscribe" button
2. App creates checkout session via API
3. User redirected to Stripe Checkout
4. User completes payment
5. Stripe sends webhook to your API
6. Webhook handler updates subscription status
7. User redirected back to success page
