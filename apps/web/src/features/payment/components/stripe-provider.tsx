'use client';

import { Elements } from '@stripe/react-stripe-js';
import { ReactNode } from 'react';
import { useStripe } from '../hooks/use-stripe';

interface StripeProviderProps {
    children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
    const { stripe, isLoading, error } = useStripe();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading payment system...</div>
            </div>
        );
    }

    if (error || !stripe) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-destructive">
                    Failed to load payment system: {error?.message || 'Unknown error'}
                </div>
            </div>
        );
    }

    return <Elements stripe={stripe}>{children}</Elements>;
}

