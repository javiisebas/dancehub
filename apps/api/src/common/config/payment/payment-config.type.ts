export type PaymentConfig = {
    stripeSecretKey: string;
    stripePublishableKey: string;
    stripeWebhookSecret: string;
    stripeApiVersion: string;
    platformFeePercentage: number;
};
