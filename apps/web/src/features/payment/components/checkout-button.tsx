'use client';

import { Button } from '@repo/ui/components';
import { PaymentTypeEnum } from '@repo/shared';
import { useCreateCheckoutSession } from '../hooks/use-payment-mutations';

interface CheckoutButtonProps {
    priceId?: string;
    amount?: number;
    currency?: string;
    quantity?: number;
    name?: string;
    description?: string;
    mode?: 'payment' | 'subscription';
    successUrl?: string;
    cancelUrl?: string;
    metadata?: Record<string, any>;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function CheckoutButton({
    priceId,
    amount,
    currency = 'usd',
    quantity = 1,
    name,
    description,
    mode = 'payment',
    successUrl,
    cancelUrl,
    metadata,
    children = 'Checkout',
    className,
    disabled,
}: CheckoutButtonProps) {
    const { mutate: createCheckout, isPending } = useCreateCheckoutSession();

    const handleCheckout = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

        createCheckout({
            lineItems: [
                {
                    priceId,
                    amount,
                    currency,
                    quantity,
                    name,
                    description,
                },
            ],
            mode: mode === 'subscription' ? PaymentTypeEnum.SUBSCRIPTION : PaymentTypeEnum.ONE_TIME,
            successUrl: successUrl || `${baseUrl}/payment/success`,
            cancelUrl: cancelUrl || `${baseUrl}/payment/canceled`,
            metadata,
        });
    };

    return (
        <Button
            onClick={handleCheckout}
            disabled={disabled || isPending}
            className={className}
        >
            {isPending ? 'Loading...' : children}
        </Button>
    );
}

