import { apiClient } from '@web/api';
import {
    CheckoutSessionResponse,
    ConnectedAccountResponse,
    CreateCheckoutSessionRequest,
    CreateConnectedAccountRequest,
    CreateMarketplacePaymentRequest,
    CreatePaymentIntentRequest,
    CreateSubscriptionRequest,
    PaymentIntentResponse,
    SubscriptionResponse,
} from '@repo/shared';

export const paymentService = {
    createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> => {
        return apiClient.post<PaymentIntentResponse, CreatePaymentIntentRequest>(
            '/payment/intent',
            data,
        );
    },

    createSubscription: async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
        return apiClient.post<SubscriptionResponse, CreateSubscriptionRequest>(
            '/payment/subscription',
            data,
        );
    },

    cancelSubscription: async (id: string): Promise<SubscriptionResponse> => {
        return apiClient.post<SubscriptionResponse, never>(`/payment/subscription/${id}/cancel`, {});
    },

    createCheckoutSession: async (
        data: CreateCheckoutSessionRequest,
    ): Promise<CheckoutSessionResponse> => {
        return apiClient.post<CheckoutSessionResponse, CreateCheckoutSessionRequest>(
            '/payment/checkout',
            data,
        );
    },

    createConnectedAccount: async (
        data: CreateConnectedAccountRequest,
    ): Promise<ConnectedAccountResponse> => {
        return apiClient.post<ConnectedAccountResponse, CreateConnectedAccountRequest>(
            '/payment/connect/account',
            data,
        );
    },

    createMarketplacePayment: async (
        data: CreateMarketplacePaymentRequest,
    ): Promise<PaymentIntentResponse> => {
        return apiClient.post<PaymentIntentResponse, CreateMarketplacePaymentRequest>(
            '/payment/marketplace',
            data,
        );
    },
};

