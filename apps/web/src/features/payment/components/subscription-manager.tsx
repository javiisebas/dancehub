'use client';

import { SubscriptionResponse } from '@repo/shared';
import { SubscriptionCard, SubscriptionData } from '@repo/ui/components/subscription-card';
import { format } from 'date-fns';
import { useCancelSubscription } from '../hooks/use-payment-mutations';

interface SubscriptionManagerProps {
    subscription: SubscriptionResponse;
    onUpdate?: () => void;
}

export function SubscriptionManager({ subscription, onUpdate }: SubscriptionManagerProps) {
    const { mutate: cancelSubscription, isPending } = useCancelSubscription();

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            cancelSubscription(subscription.id, {
                onSuccess: () => {
                    onUpdate?.();
                },
            });
        }
    };

    const subscriptionData: SubscriptionData = {
        id: subscription.id,
        status: subscription.status as SubscriptionData['status'],
        amount: subscription.amount,
        currency: subscription.currency,
        interval: subscription.interval as SubscriptionData['interval'],
        currentPeriodEnd: subscription.currentPeriodEnd,
        trialEnd: subscription.trialEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };

    return (
        <SubscriptionCard
            subscription={subscriptionData}
            onCancel={handleCancel}
            isCancelling={isPending}
            formatDate={(date) => format(date, 'MMM dd, yyyy')}
        />
    );
}
