import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedAccountForm } from './connected-account-form';

const meta = {
    title: 'Components/ConnectedAccountForm',
    component: ConnectedAccountForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ConnectedAccountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onSubmit: (data) => console.log('Form submitted:', data),
        isSubmitting: false,
    },
};

export const Submitting: Story = {
    args: {
        onSubmit: (data) => console.log('Form submitted:', data),
        isSubmitting: true,
    },
};

export const CustomText: Story = {
    args: {
        title: 'Become a Seller',
        description:
            'Set up your seller account to start accepting payments and manage your products.',
        onSubmit: (data) => console.log('Form submitted:', data),
        isSubmitting: false,
    },
};
