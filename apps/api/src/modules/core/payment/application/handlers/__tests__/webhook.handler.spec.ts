import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentStatusEnum, SubscriptionStatusEnum } from '@repo/shared';
import { ConnectedAccount } from '../../../domain/entities/connected-account.entity';
import { PaymentIntent } from '../../../domain/entities/payment-intent.entity';
import { Subscription } from '../../../domain/entities/subscription.entity';
import { WebhookEvent } from '../../../domain/entities/webhook-event.entity';
import {
    CONNECTED_ACCOUNT_REPOSITORY,
    IConnectedAccountRepository,
} from '../../../domain/repositories/i-connected-account.repository';
import {
    IPaymentIntentRepository,
    PAYMENT_INTENT_REPOSITORY,
} from '../../../domain/repositories/i-payment-intent.repository';
import {
    ISubscriptionRepository,
    SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/i-subscription.repository';
import {
    IWebhookEventRepository,
    WEBHOOK_EVENT_REPOSITORY,
} from '../../../domain/repositories/i-webhook-event.repository';
import { StripeService } from '../../../domain/services/stripe.service';
import { WebhookHandler } from '../webhook.handler';

describe('WebhookHandler', () => {
    let handler: WebhookHandler;
    let paymentIntentRepository: jest.Mocked<IPaymentIntentRepository>;
    let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
    let connectedAccountRepository: jest.Mocked<IConnectedAccountRepository>;
    let webhookEventRepository: jest.Mocked<IWebhookEventRepository>;
    let stripeService: jest.Mocked<StripeService>;

    beforeEach(async () => {
        const mockPaymentIntentRepository = {
            findByStripePaymentIntentId: jest.fn(),
            update: jest.fn(),
        };

        const mockSubscriptionRepository = {
            findByStripeSubscriptionId: jest.fn(),
            update: jest.fn(),
        };

        const mockConnectedAccountRepository = {
            findByStripeAccountId: jest.fn(),
            update: jest.fn(),
        };

        const mockWebhookEventRepository = {
            findByStripeEventId: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
        };

        const mockStripeService = {
            constructWebhookEvent: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WebhookHandler,
                {
                    provide: WEBHOOK_EVENT_REPOSITORY,
                    useValue: mockWebhookEventRepository,
                },
                {
                    provide: PAYMENT_INTENT_REPOSITORY,
                    useValue: mockPaymentIntentRepository,
                },
                {
                    provide: SUBSCRIPTION_REPOSITORY,
                    useValue: mockSubscriptionRepository,
                },
                {
                    provide: CONNECTED_ACCOUNT_REPOSITORY,
                    useValue: mockConnectedAccountRepository,
                },
                {
                    provide: StripeService,
                    useValue: mockStripeService,
                },
            ],
        }).compile();

        handler = module.get<WebhookHandler>(WebhookHandler);
        paymentIntentRepository = module.get(PAYMENT_INTENT_REPOSITORY);
        subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY);
        connectedAccountRepository = module.get(CONNECTED_ACCOUNT_REPOSITORY);
        webhookEventRepository = module.get(WEBHOOK_EVENT_REPOSITORY);
        stripeService = module.get(StripeService);

        jest.spyOn(Logger.prototype, 'log').mockImplementation();
        jest.spyOn(Logger.prototype, 'error').mockImplementation();

        // Default mocks
        webhookEventRepository.findByStripeEventId.mockResolvedValue(null);
        webhookEventRepository.save.mockResolvedValue({} as any);
        webhookEventRepository.update.mockResolvedValue({} as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(handler).toBeDefined();
    });

    describe('handleWebhook - signature verification', () => {
        it('should throw error on invalid signature', async () => {
            stripeService.constructWebhookEvent.mockRejectedValue(new Error('Invalid signature'));

            await expect(
                handler.handleWebhook(Buffer.from('{}'), 'invalid_sig', 'whsec_test'),
            ).rejects.toThrow('Invalid signature');
        });

        it('should skip already processed events', async () => {
            const existingEvent = WebhookEvent.create(
                'evt_test_123',
                'payment_intent.succeeded',
                {} as any,
            );
            webhookEventRepository.findByStripeEventId.mockResolvedValue(existingEvent);

            const event = {
                id: 'evt_test_123',
                type: 'payment_intent.succeeded',
                data: { object: {} },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(webhookEventRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('payment_intent.succeeded', () => {
        it('should update payment intent status to succeeded', async () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                'usd' as any,
                'one_time' as any,
            );

            paymentIntentRepository.findByStripePaymentIntentId.mockResolvedValue(paymentIntent);
            paymentIntentRepository.update.mockResolvedValue(paymentIntent);

            const event = {
                id: 'evt_test_123',
                type: 'payment_intent.succeeded',
                data: { object: { id: 'pi_test_123', status: 'succeeded' } },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(paymentIntentRepository.findByStripePaymentIntentId).toHaveBeenCalledWith(
                'pi_test_123',
            );
            expect(paymentIntent.status).toBe(PaymentStatusEnum.SUCCEEDED);
            expect(paymentIntentRepository.update).toHaveBeenCalledWith(
                paymentIntent.id,
                paymentIntent,
            );
            expect(webhookEventRepository.save).toHaveBeenCalled();
        });

        it('should handle payment intent not found gracefully', async () => {
            paymentIntentRepository.findByStripePaymentIntentId.mockResolvedValue(null);

            const event = {
                id: 'evt_test_123',
                type: 'payment_intent.succeeded',
                data: { object: { id: 'pi_not_found', status: 'succeeded' } },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(paymentIntentRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('payment_intent.payment_failed', () => {
        it('should update payment intent status to failed', async () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                'usd' as any,
                'one_time' as any,
            );

            paymentIntentRepository.findByStripePaymentIntentId.mockResolvedValue(paymentIntent);
            paymentIntentRepository.update.mockResolvedValue(paymentIntent);

            const event = {
                id: 'evt_test_123',
                type: 'payment_intent.payment_failed',
                data: { object: { id: 'pi_test_123', status: 'failed' } },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(paymentIntent.status).toBe(PaymentStatusEnum.FAILED);
            expect(paymentIntentRepository.update).toHaveBeenCalledWith(
                paymentIntent.id,
                paymentIntent,
            );
        });
    });

    describe('payment_intent.canceled', () => {
        it('should update payment intent status to canceled', async () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                'usd' as any,
                'one_time' as any,
            );

            paymentIntentRepository.findByStripePaymentIntentId.mockResolvedValue(paymentIntent);
            paymentIntentRepository.update.mockResolvedValue(paymentIntent);

            const event = {
                id: 'evt_test_123',
                type: 'payment_intent.canceled',
                data: { object: { id: 'pi_test_123', status: 'canceled' } },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(paymentIntent.status).toBe(PaymentStatusEnum.CANCELED);
            expect(paymentIntentRepository.update).toHaveBeenCalledWith(
                paymentIntent.id,
                paymentIntent,
            );
        });
    });

    describe('customer.subscription.updated', () => {
        it('should update subscription status and periods', async () => {
            const now = Date.now() / 1000;
            const oneMonthLater = now + 30 * 24 * 60 * 60;

            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                new Date(now * 1000),
                new Date(oneMonthLater * 1000),
                'month' as any,
                1,
                2999,
                'usd' as any,
            );

            subscriptionRepository.findByStripeSubscriptionId.mockResolvedValue(subscription);
            subscriptionRepository.update.mockResolvedValue(subscription);

            const event = {
                id: 'evt_test_123',
                type: 'customer.subscription.updated',
                data: {
                    object: {
                        id: 'sub_test_123',
                        status: 'active',
                        current_period_start: now,
                        current_period_end: oneMonthLater,
                        cancel_at_period_end: false,
                        canceled_at: null,
                    },
                },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(subscription.status).toBe(SubscriptionStatusEnum.ACTIVE);
            expect(subscription.cancelAtPeriodEnd).toBe(false);
            expect(subscriptionRepository.update).toHaveBeenCalledWith(
                subscription.id,
                subscription,
            );
        });

        it('should handle subscription with canceled_at date', async () => {
            const now = Date.now() / 1000;
            const canceledAt = now - 24 * 60 * 60;

            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                new Date(now * 1000),
                new Date(now * 1000),
                'month' as any,
                1,
                2999,
                'usd' as any,
            );

            subscriptionRepository.findByStripeSubscriptionId.mockResolvedValue(subscription);
            subscriptionRepository.update.mockResolvedValue(subscription);

            const event = {
                id: 'evt_test_123',
                type: 'customer.subscription.updated',
                data: {
                    object: {
                        id: 'sub_test_123',
                        status: 'canceled',
                        current_period_start: now,
                        current_period_end: now,
                        cancel_at_period_end: false,
                        canceled_at: canceledAt,
                    },
                },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(subscription.canceledAt).toBeInstanceOf(Date);
            expect(subscriptionRepository.update).toHaveBeenCalled();
        });
    });

    describe('customer.subscription.deleted', () => {
        it('should mark subscription as canceled', async () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                new Date(),
                new Date(),
                'month' as any,
                1,
                2999,
                'usd' as any,
            );

            subscriptionRepository.findByStripeSubscriptionId.mockResolvedValue(subscription);
            subscriptionRepository.update.mockResolvedValue(subscription);

            const event = {
                id: 'evt_test_123',
                type: 'customer.subscription.deleted',
                data: { object: { id: 'sub_test_123', status: 'canceled' } },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(subscription.status).toBe(SubscriptionStatusEnum.CANCELED);
            expect(subscription.canceledAt).toBeInstanceOf(Date);
            expect(subscriptionRepository.update).toHaveBeenCalled();
        });
    });

    describe('invoice.paid', () => {
        it('should activate subscription on invoice paid', async () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                new Date(),
                new Date(),
                'month' as any,
                1,
                2999,
                'usd' as any,
            );

            subscriptionRepository.findByStripeSubscriptionId.mockResolvedValue(subscription);
            subscriptionRepository.update.mockResolvedValue(subscription);

            const event = {
                id: 'evt_test_123',
                type: 'invoice.paid',
                data: {
                    object: { id: 'in_test_123', subscription: 'sub_test_123', status: 'paid' },
                },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(subscription.status).toBe(SubscriptionStatusEnum.ACTIVE);
            expect(subscriptionRepository.update).toHaveBeenCalled();
        });

        it('should skip if invoice has no subscription', async () => {
            const event = {
                id: 'evt_test_123',
                type: 'invoice.paid',
                data: { object: { id: 'in_test_123', subscription: null, status: 'paid' } },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(subscriptionRepository.findByStripeSubscriptionId).not.toHaveBeenCalled();
        });
    });

    describe('invoice.payment_failed', () => {
        it('should mark subscription as past_due', async () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                new Date(),
                new Date(),
                'month' as any,
                1,
                2999,
                'usd' as any,
            );

            subscriptionRepository.findByStripeSubscriptionId.mockResolvedValue(subscription);
            subscriptionRepository.update.mockResolvedValue(subscription);

            const event = {
                id: 'evt_test_123',
                type: 'invoice.payment_failed',
                data: {
                    object: { id: 'in_test_123', subscription: 'sub_test_123', status: 'open' },
                },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(subscription.status).toBe(SubscriptionStatusEnum.PAST_DUE);
            expect(subscriptionRepository.update).toHaveBeenCalled();
        });
    });

    describe('account.updated', () => {
        it('should update connected account capabilities', async () => {
            const connectedAccount = ConnectedAccount.create('user-123', 'acct_test_123');

            connectedAccountRepository.findByStripeAccountId.mockResolvedValue(connectedAccount);
            connectedAccountRepository.update.mockResolvedValue(connectedAccount);

            const event = {
                id: 'evt_test_123',
                type: 'account.updated',
                data: {
                    object: {
                        id: 'acct_test_123',
                        charges_enabled: true,
                        details_submitted: true,
                        capabilities: { card_payments: 'active', transfers: 'active' },
                    },
                },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test');

            expect(connectedAccount.chargesEnabled).toBe(true);
            expect(connectedAccount.detailsSubmitted).toBe(true);
            expect(connectedAccountRepository.update).toHaveBeenCalled();
        });
    });

    describe('unhandled event types', () => {
        it('should log unhandled event types without throwing', async () => {
            const event = {
                id: 'evt_test_123',
                type: 'customer.created',
                data: { object: {} },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await expect(
                handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test'),
            ).resolves.not.toThrow();
        });
    });

    describe('error handling', () => {
        it('should mark webhook event as failed when processing fails', async () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                'usd' as any,
                'one_time' as any,
            );

            paymentIntentRepository.findByStripePaymentIntentId.mockResolvedValue(paymentIntent);
            paymentIntentRepository.update.mockRejectedValue(new Error('Database error'));

            const event = {
                id: 'evt_test_123',
                type: 'payment_intent.succeeded',
                data: { object: { id: 'pi_test_123', status: 'succeeded' } },
            } as any;

            stripeService.constructWebhookEvent.mockResolvedValue(event);

            await expect(
                handler.handleWebhook(Buffer.from('{}'), 'sig_test', 'whsec_test'),
            ).rejects.toThrow('Database error');

            // Verify webhook event was marked as failed
            expect(webhookEventRepository.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    processed: false,
                    error: 'Database error',
                }),
            );
        });
    });
});
