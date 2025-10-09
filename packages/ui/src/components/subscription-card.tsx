'use client';

import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export interface SubscriptionData {
    id: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
    amount: number;
    currency: string;
    interval: 'month' | 'year' | 'week' | 'day';
    currentPeriodEnd: string | Date;
    trialEnd?: string | Date | null;
    cancelAtPeriodEnd: boolean;
}

interface SubscriptionCardProps {
    subscription: SubscriptionData;
    onCancel?: () => void;
    isCancelling?: boolean;
    formatDate?: (date: Date) => string;
}

export function SubscriptionCard({
    subscription,
    onCancel,
    isCancelling = false,
    formatDate = (date) => date.toLocaleDateString(),
}: SubscriptionCardProps) {
    const getStatusVariant = (status: SubscriptionData['status']) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'trialing':
                return 'secondary';
            case 'past_due':
            case 'unpaid':
                return 'destructive';
            case 'canceled':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Subscription</CardTitle>
                    <Badge variant={getStatusVariant(subscription.status)}>
                        {subscription.status.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">
                            {formatCurrency(subscription.amount, subscription.currency)}/
                            {subscription.interval}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Current period ends</span>
                        <span className="font-medium">
                            {formatDate(new Date(subscription.currentPeriodEnd))}
                        </span>
                    </div>

                    {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Trial ends</span>
                            <span className="font-medium">
                                {formatDate(new Date(subscription.trialEnd))}
                            </span>
                        </div>
                    )}
                </div>

                {subscription.cancelAtPeriodEnd && (
                    <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Your subscription will be cancelled at the end of the current period.
                    </div>
                )}

                {subscription.status === 'active' &&
                    !subscription.cancelAtPeriodEnd &&
                    onCancel && (
                        <Button
                            variant="destructive"
                            onClick={onCancel}
                            disabled={isCancelling}
                            className="w-full"
                        >
                            {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                        </Button>
                    )}
            </CardContent>
        </Card>
    );
}
