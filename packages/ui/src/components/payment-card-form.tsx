'use client';

import { ReactNode } from 'react';
import { Button } from './button';

export interface PaymentFormData {
    amount: number;
    currency: string;
}

interface PaymentCardFormProps {
    paymentData: PaymentFormData;
    onSubmit: (e: React.FormEvent) => void;
    isProcessing?: boolean;
    disabled?: boolean;
    children: ReactNode;
    className?: string;
}

export function PaymentCardForm({
    paymentData,
    onSubmit,
    isProcessing = false,
    disabled = false,
    children,
    className,
}: PaymentCardFormProps) {
    return (
        <form onSubmit={onSubmit} className={className}>
            <div className="space-y-6">
                {children}

                <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: paymentData.currency,
                        }).format(paymentData.amount / 100)}
                    </span>
                </div>

                <Button type="submit" className="w-full" disabled={disabled || isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
            </div>
        </form>
    );
}
