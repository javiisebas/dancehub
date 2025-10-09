import { CurrentUser } from '@api/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@api/common/guards/jwt-auth.guard';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Body, Controller, Param, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
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
import { CancelSubscriptionHandler } from '../../application/commands/cancel-subscription.handler';
import {
    CreateCheckoutSessionCommand,
    CreateCheckoutSessionHandler,
} from '../../application/commands/create-checkout-session.handler';
import {
    CreateConnectedAccountCommand,
    CreateConnectedAccountHandler,
} from '../../application/commands/create-connected-account.handler';
import {
    CreateMarketplacePaymentCommand,
    CreateMarketplacePaymentHandler,
} from '../../application/commands/create-marketplace-payment.handler';
import {
    CreatePaymentIntentCommand,
    CreatePaymentIntentHandler,
} from '../../application/commands/create-payment-intent.handler';
import {
    CreateSubscriptionCommand,
    CreateSubscriptionHandler,
} from '../../application/commands/create-subscription.handler';
import { EnsureCustomerHandler } from '../../application/commands/ensure-customer.handler';
import { WebhookHandler } from '../../application/handlers/webhook.handler';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly ensureCustomerHandler: EnsureCustomerHandler,
        private readonly createPaymentIntentHandler: CreatePaymentIntentHandler,
        private readonly createSubscriptionHandler: CreateSubscriptionHandler,
        private readonly createCheckoutSessionHandler: CreateCheckoutSessionHandler,
        private readonly createConnectedAccountHandler: CreateConnectedAccountHandler,
        private readonly createMarketplacePaymentHandler: CreateMarketplacePaymentHandler,
        private readonly cancelSubscriptionHandler: CancelSubscriptionHandler,
        private readonly webhookHandler: WebhookHandler,
        private readonly configService: TypedConfigService,
    ) {}

    @Post('intent')
    @UseGuards(JwtAuthGuard)
    async createPaymentIntent(
        @CurrentUser() user: User,
        @Body() dto: CreatePaymentIntentRequest,
    ): Promise<PaymentIntentResponse> {
        await this.ensureCustomerHandler.execute(user.id);
        const command = new CreatePaymentIntentCommand(dto);
        const paymentIntent = await this.createPaymentIntentHandler.execute({
            ...command,
            userId: user.id,
        });

        return {
            id: paymentIntent.id,
            userId: paymentIntent.userId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            paymentType: paymentIntent.paymentType,
            stripePaymentIntentId: paymentIntent.stripePaymentIntentId,
            description: paymentIntent.description,
            metadata: paymentIntent.metadata,
            createdAt: paymentIntent.createdAt,
            updatedAt: paymentIntent.updatedAt,
        } as PaymentIntentResponse;
    }

    @Post('subscription')
    @UseGuards(JwtAuthGuard)
    async createSubscription(
        @CurrentUser() user: User,
        @Body() dto: CreateSubscriptionRequest,
    ): Promise<SubscriptionResponse> {
        await this.ensureCustomerHandler.execute(user.id);
        const command = new CreateSubscriptionCommand(dto);
        const subscription = await this.createSubscriptionHandler.execute({
            ...command,
            userId: user.id,
        });

        return {
            id: subscription.id,
            userId: subscription.userId,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            stripePriceId: subscription.stripePriceId,
            stripeProductId: subscription.stripeProductId,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            interval: subscription.interval,
            intervalCount: subscription.intervalCount,
            amount: subscription.amount,
            currency: subscription.currency,
            trialEnd: subscription.trialEnd,
            canceledAt: subscription.canceledAt,
            metadata: subscription.metadata,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
        } as SubscriptionResponse;
    }

    @Post('subscription/:id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelSubscription(@Param('id') id: string): Promise<SubscriptionResponse> {
        const subscription = await this.cancelSubscriptionHandler.execute(id, true);

        return {
            id: subscription.id,
            userId: subscription.userId,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            stripePriceId: subscription.stripePriceId,
            stripeProductId: subscription.stripeProductId,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            interval: subscription.interval,
            intervalCount: subscription.intervalCount,
            amount: subscription.amount,
            currency: subscription.currency,
            trialEnd: subscription.trialEnd,
            canceledAt: subscription.canceledAt,
            metadata: subscription.metadata,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
        } as SubscriptionResponse;
    }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    async createCheckoutSession(
        @CurrentUser() user: User,
        @Body() dto: CreateCheckoutSessionRequest,
    ): Promise<CheckoutSessionResponse> {
        await this.ensureCustomerHandler.execute(user.id);
        const command = new CreateCheckoutSessionCommand(dto);
        const result = await this.createCheckoutSessionHandler.execute({
            ...command,
            userId: user.id,
        });

        return {
            sessionId: result.sessionId,
            url: result.url,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        } as CheckoutSessionResponse;
    }

    @Post('connect/account')
    @UseGuards(JwtAuthGuard)
    async createConnectedAccount(
        @CurrentUser() user: User,
        @Body() dto: CreateConnectedAccountRequest,
    ): Promise<ConnectedAccountResponse> {
        const command = new CreateConnectedAccountCommand(dto);
        const result = await this.createConnectedAccountHandler.execute({
            ...command,
            userId: user.id,
        });

        return {
            id: result.account.id,
            userId: result.account.userId,
            stripeAccountId: result.account.stripeAccountId,
            chargesEnabled: result.account.chargesEnabled,
            payoutsEnabled: result.account.payoutsEnabled,
            detailsSubmitted: result.account.detailsSubmitted,
            onboardingUrl: result.onboardingUrl,
            createdAt: result.account.createdAt,
            updatedAt: result.account.updatedAt,
        } as ConnectedAccountResponse;
    }

    @Post('marketplace')
    @UseGuards(JwtAuthGuard)
    async createMarketplacePayment(
        @CurrentUser() user: User,
        @Body() dto: CreateMarketplacePaymentRequest,
    ): Promise<PaymentIntentResponse> {
        await this.ensureCustomerHandler.execute(user.id);
        const command = new CreateMarketplacePaymentCommand(dto);
        const paymentIntent = await this.createMarketplacePaymentHandler.execute({
            ...command,
            userId: user.id,
        });

        return {
            id: paymentIntent.id,
            userId: paymentIntent.userId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            paymentType: paymentIntent.paymentType,
            stripePaymentIntentId: paymentIntent.stripePaymentIntentId,
            description: paymentIntent.description,
            metadata: paymentIntent.metadata,
            createdAt: paymentIntent.createdAt,
            updatedAt: paymentIntent.updatedAt,
        } as PaymentIntentResponse;
    }

    @Post('webhook')
    async handleWebhook(@Req() req: RawBodyRequest<Request>): Promise<{ received: boolean }> {
        const signature = req.headers['stripe-signature'] as string;
        const webhookSecret = this.configService.get('payment.stripeWebhookSecret', '');

        if (!req.rawBody) {
            throw new Error('Raw body not available');
        }

        await this.webhookHandler.handleWebhook(req.rawBody, signature, webhookSecret);

        return { received: true };
    }
}
