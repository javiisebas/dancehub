'use client';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from '@repo/ui/components';
import { useState } from 'react';
import { toast } from 'sonner';
import { PaymentIntentResponse } from '@repo/shared';

interface PaymentFormProps {
    paymentIntent: PaymentIntentResponse;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function PaymentForm({ paymentIntent, onSuccess, onError }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!paymentIntent.clientSecret) {
            toast.error('Payment configuration error');
            return;
        }

        setIsProcessing(true);

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
                paymentIntent.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                },
            );

            if (error) {
                throw new Error(error.message);
            }

            if (confirmedPayment?.status === 'succeeded') {
                toast.success('Payment successful!');
                onSuccess?.();
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Payment failed');
            toast.error(error.message);
            onError?.(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border p-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: 'hsl(var(--foreground))',
                                '::placeholder': {
                                    color: 'hsl(var(--muted-foreground))',
                                },
                            },
                            invalid: {
                                color: 'hsl(var(--destructive))',
                            },
                        },
                    }}
                />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <span className="font-medium">Total</span>
                <span className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: paymentIntent.currency,
                    }).format(paymentIntent.amount / 100)}
                </span>
            </div>

            <Button type="submit" className="w-full" disabled={!stripe || isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
        </form>
    );
}

