import type { Meta, StoryObj } from '@storybook/react';
import { PaymentCardForm } from './payment-card-form';

const meta: Meta<typeof PaymentCardForm> = {
    title: 'Complex/PaymentCardForm',
    component: PaymentCardForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaymentCardForm>;

export const Default: Story = {
    args: {
        paymentData: {
            amount: 4999,
            currency: 'usd',
        },
        onSubmit: (e) => {
            e.preventDefault();
            console.log('Payment submitted');
        },
    },
    render: (args) => (
        <div className="w-[500px]">
            <PaymentCardForm {...args}>
                <div className="rounded-lg border p-4">
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">Payment Method</p>
                        <p className="text-muted-foreground">
                            Card input would go here (Stripe CardElement)
                        </p>
                    </div>
                </div>
            </PaymentCardForm>
        </div>
    ),
};

export const Processing: Story = {
    args: {
        paymentData: {
            amount: 9999,
            currency: 'eur',
        },
        isProcessing: true,
        onSubmit: (e) => e.preventDefault(),
    },
    render: (args) => (
        <div className="w-[500px]">
            <PaymentCardForm {...args}>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Processing payment...</p>
                </div>
            </PaymentCardForm>
        </div>
    ),
};

export const Disabled: Story = {
    args: {
        paymentData: {
            amount: 1999,
            currency: 'gbp',
        },
        disabled: true,
        onSubmit: (e) => e.preventDefault(),
    },
    render: (args) => (
        <div className="w-[500px]">
            <PaymentCardForm {...args}>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Form is disabled</p>
                </div>
            </PaymentCardForm>
        </div>
    ),
};

export const LargeAmount: Story = {
    args: {
        paymentData: {
            amount: 1234567,
            currency: 'usd',
        },
        onSubmit: (e) => {
            e.preventDefault();
            alert('Payment submitted!');
        },
    },
    render: (args) => (
        <div className="w-[500px]">
            <PaymentCardForm {...args}>
                <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm font-medium">Order Summary</p>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Premium Plan</span>
                                <span>$12,345.67</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PaymentCardForm>
        </div>
    ),
};
