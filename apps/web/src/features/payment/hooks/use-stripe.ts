'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

let stripePromise: Promise<Stripe | null> | null = null;

export const useStripe = () => {
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
            setError(new Error('Stripe publishable key not configured'));
            setIsLoading(false);
            return;
        }

        if (!stripePromise) {
            stripePromise = loadStripe(publishableKey);
        }

        stripePromise
            .then((stripeInstance) => {
                setStripe(stripeInstance);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, []);

    return { stripe, isLoading, error };
};

