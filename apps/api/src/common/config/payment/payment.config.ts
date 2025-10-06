import { registerAs } from '@nestjs/config';
import { PaymentConfig } from './payment-config.type';

export default registerAs<PaymentConfig>('payment', () => ({
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    stripeApiVersion: '2024-12-18.acacia',
    platformFeePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '5'),
}));
