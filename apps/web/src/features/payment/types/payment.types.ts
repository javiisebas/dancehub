export * from '@repo/shared';

export type PaymentMethod = {
    id: string;
    type: string;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
};

export type CheckoutOptions = {
    mode: 'payment' | 'subscription';
    successUrl: string;
    cancelUrl: string;
    lineItems: Array<{
        priceId?: string;
        amount?: number;
        currency?: string;
        quantity: number;
        name?: string;
        description?: string;
    }>;
    metadata?: Record<string, any>;
};

