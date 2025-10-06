import { UserModule } from '@api/modules/user/user.module';
import { Module } from '@nestjs/common';
import { CancelSubscriptionHandler } from './application/commands/cancel-subscription.handler';
import { CreateCheckoutSessionHandler } from './application/commands/create-checkout-session.handler';
import { CreateConnectedAccountHandler } from './application/commands/create-connected-account.handler';
import { CreateMarketplacePaymentHandler } from './application/commands/create-marketplace-payment.handler';
import { CreatePaymentIntentHandler } from './application/commands/create-payment-intent.handler';
import { CreateSubscriptionHandler } from './application/commands/create-subscription.handler';
import { EnsureCustomerHandler } from './application/commands/ensure-customer.handler';
import { WebhookHandler } from './application/handlers/webhook.handler';
import { PaymentFacadeService } from './application/services/payment-facade.service';
import { CONNECTED_ACCOUNT_REPOSITORY } from './domain/repositories/i-connected-account.repository';
import { CUSTOMER_REPOSITORY } from './domain/repositories/i-customer.repository';
import { PAYMENT_INTENT_REPOSITORY } from './domain/repositories/i-payment-intent.repository';
import { SUBSCRIPTION_REPOSITORY } from './domain/repositories/i-subscription.repository';
import { WEBHOOK_EVENT_REPOSITORY } from './domain/repositories/i-webhook-event.repository';
import { StripeService } from './domain/services/stripe.service';
import { PaymentController } from './infrastructure/controllers/payment.controller';
import { ConnectedAccountRepositoryImpl } from './infrastructure/repositories/connected-account.repository';
import { CustomerRepositoryImpl } from './infrastructure/repositories/customer.repository';
import { PaymentIntentRepositoryImpl } from './infrastructure/repositories/payment-intent.repository';
import { SubscriptionRepositoryImpl } from './infrastructure/repositories/subscription.repository';
import { WebhookEventRepositoryImpl } from './infrastructure/repositories/webhook-event.repository';

const repositories = [
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepositoryImpl },
    { provide: PAYMENT_INTENT_REPOSITORY, useClass: PaymentIntentRepositoryImpl },
    { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionRepositoryImpl },
    { provide: CONNECTED_ACCOUNT_REPOSITORY, useClass: ConnectedAccountRepositoryImpl },
    { provide: WEBHOOK_EVENT_REPOSITORY, useClass: WebhookEventRepositoryImpl },
];

const commandHandlers = [
    EnsureCustomerHandler,
    CreatePaymentIntentHandler,
    CreateSubscriptionHandler,
    CreateCheckoutSessionHandler,
    CreateConnectedAccountHandler,
    CreateMarketplacePaymentHandler,
    CancelSubscriptionHandler,
];

const eventHandlers = [WebhookHandler];

const services = [StripeService, PaymentFacadeService];

@Module({
    imports: [UserModule],
    controllers: [PaymentController],
    providers: [...repositories, ...commandHandlers, ...eventHandlers, ...services],
    exports: [...repositories, ...services, EnsureCustomerHandler],
})
export class PaymentModule {}
