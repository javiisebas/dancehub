import type { Meta, StoryObj } from '@storybook/react';
import { SubscriptionCard, SubscriptionData } from './subscription-card';

const meta = {
    title: 'Components/SubscriptionCard',
    component: SubscriptionCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SubscriptionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const activeSubscription: SubscriptionData = {
    id: '1',
    status: 'active',
    amount: 2999,
    currency: 'usd',
    interval: 'month',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
};

const trialingSubscription: SubscriptionData = {
    id: '2',
    status: 'trialing',
    amount: 4999,
    currency: 'usd',
    interval: 'year',
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
};

const cancellingSubscription: SubscriptionData = {
    id: '3',
    status: 'active',
    amount: 1999,
    currency: 'eur',
    interval: 'month',
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: true,
};

const pastDueSubscription: SubscriptionData = {
    id: '4',
    status: 'past_due',
    amount: 2999,
    currency: 'usd',
    interval: 'month',
    currentPeriodEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
};

export const Active: Story = {
    args: {
        subscription: activeSubscription,
        onCancel: () => console.log('Cancel clicked'),
        isCancelling: false,
    },
};

export const Trialing: Story = {
    args: {
        subscription: trialingSubscription,
        onCancel: () => console.log('Cancel clicked'),
        isCancelling: false,
    },
};

export const CancelAtPeriodEnd: Story = {
    args: {
        subscription: cancellingSubscription,
    },
};

export const PastDue: Story = {
    args: {
        subscription: pastDueSubscription,
        onCancel: () => console.log('Cancel clicked'),
        isCancelling: false,
    },
};

export const Cancelling: Story = {
    args: {
        subscription: activeSubscription,
        onCancel: () => console.log('Cancel clicked'),
        isCancelling: true,
    },
};

export const WithoutCancelButton: Story = {
    args: {
        subscription: activeSubscription,
    },
};
