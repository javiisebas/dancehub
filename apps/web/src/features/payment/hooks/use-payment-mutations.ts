'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    CreateCheckoutSessionRequest,
    CreateConnectedAccountRequest,
    CreateMarketplacePaymentRequest,
    CreatePaymentIntentRequest,
    CreateSubscriptionRequest,
} from '@repo/shared';
import { paymentService } from '../api/payment.service';

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: (data: CreatePaymentIntentRequest) => paymentService.createPaymentIntent(data),
        onSuccess: () => {
            toast.success('Payment intent created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create payment intent');
        },
    });
};

export const useCreateSubscription = () => {
    return useMutation({
        mutationFn: (data: CreateSubscriptionRequest) => paymentService.createSubscription(data),
        onSuccess: () => {
            toast.success('Subscription created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create subscription');
        },
    });
};

export const useCancelSubscription = () => {
    return useMutation({
        mutationFn: (id: string) => paymentService.cancelSubscription(id),
        onSuccess: () => {
            toast.success('Subscription cancelled successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to cancel subscription');
        },
    });
};

export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: (data: CreateCheckoutSessionRequest) =>
            paymentService.createCheckoutSession(data),
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url;
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create checkout session');
        },
    });
};

export const useCreateConnectedAccount = () => {
    return useMutation({
        mutationFn: (data: CreateConnectedAccountRequest) =>
            paymentService.createConnectedAccount(data),
        onSuccess: (data) => {
            toast.success('Connected account created successfully');
            if (data.onboardingUrl) {
                window.location.href = data.onboardingUrl;
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create connected account');
        },
    });
};

export const useCreateMarketplacePayment = () => {
    return useMutation({
        mutationFn: (data: CreateMarketplacePaymentRequest) =>
            paymentService.createMarketplacePayment(data),
        onSuccess: () => {
            toast.success('Marketplace payment created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create marketplace payment');
        },
    });
};

