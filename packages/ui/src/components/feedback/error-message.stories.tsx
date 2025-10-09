import type { Meta, StoryObj } from '@storybook/react';
import { ErrorMessage } from './error-message';

const meta: Meta<typeof ErrorMessage> = {
    title: 'UI/Feedback/ErrorMessage',
    component: ErrorMessage,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        message: 'An error occurred while processing your request.',
    },
};

export const WithTitle: Story = {
    args: {
        title: 'Error',
        message: 'Failed to load data. Please try again.',
    },
};

export const NetworkError: Story = {
    args: {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
    },
};

export const ValidationError: Story = {
    args: {
        title: 'Validation Error',
        message: 'Please fill in all required fields correctly.',
    },
};
