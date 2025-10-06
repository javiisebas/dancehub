import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyEnum } from '@repo/shared';
import Stripe from 'stripe';
import { Customer } from '../../../domain/entities/customer.entity';
import {
    CUSTOMER_REPOSITORY,
    ICustomerRepository,
} from '../../../domain/repositories/i-customer.repository';
import {
    IPaymentIntentRepository,
    PAYMENT_INTENT_REPOSITORY,
} from '../../../domain/repositories/i-payment-intent.repository';
import { StripeService } from '../../../domain/services/stripe.service';
import {
    CreatePaymentIntentCommand,
    CreatePaymentIntentHandler,
} from '../create-payment-intent.handler';

describe('CreatePaymentIntentHandler', () => {
    let handler: CreatePaymentIntentHandler;
    let paymentIntentRepository: jest.Mocked<IPaymentIntentRepository>;
    let customerRepository: jest.Mocked<ICustomerRepository>;
    let stripeService: jest.Mocked<StripeService>;

    beforeEach(async () => {
        const mockPaymentIntentRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
        };

        const mockCustomerRepository = {
            findByUserId: jest.fn(),
        };

        const mockStripeService = {
            createPaymentIntent: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreatePaymentIntentHandler,
                {
                    provide: PAYMENT_INTENT_REPOSITORY,
                    useValue: mockPaymentIntentRepository,
                },
                {
                    provide: CUSTOMER_REPOSITORY,
                    useValue: mockCustomerRepository,
                },
                {
                    provide: StripeService,
                    useValue: mockStripeService,
                },
            ],
        }).compile();

        handler = module.get<CreatePaymentIntentHandler>(CreatePaymentIntentHandler);
        paymentIntentRepository = module.get(PAYMENT_INTENT_REPOSITORY);
        customerRepository = module.get(CUSTOMER_REPOSITORY);
        stripeService = module.get(StripeService);
    });

    it('should be defined', () => {
        expect(handler).toBeDefined();
    });

    describe('execute', () => {
        const customer = Customer.create(
            'user-123',
            'cus_test_123',
            'test@example.com',
            'Test User',
        );

        const command = new CreatePaymentIntentCommand({
            amount: 2000,
            currency: CurrencyEnum.USD,
            paymentType: 'one_time' as any,
            description: 'Test payment',
            metadata: { orderId: 'order-123' },
        });

        it('should create payment intent successfully', async () => {
            const stripePaymentIntent = {
                id: 'pi_test_123',
                object: 'payment_intent',
                amount: 2000,
                currency: 'usd',
                status: 'requires_payment_method',
                client_secret: 'pi_test_123_secret',
            } as Stripe.PaymentIntent;

            customerRepository.findByUserId.mockResolvedValue(customer);
            stripeService.createPaymentIntent.mockResolvedValue(stripePaymentIntent);
            paymentIntentRepository.save.mockImplementation((payment) => Promise.resolve(payment));

            const result = await handler.execute({ ...command, userId: 'user-123' });

            expect(customerRepository.findByUserId).toHaveBeenCalledWith('user-123');
            expect(stripeService.createPaymentIntent).toHaveBeenCalledWith({
                amount: 2000,
                currency: 'usd',
                customer: 'cus_test_123',
                description: 'Test payment',
                metadata: {
                    userId: 'user-123',
                    paymentType: 'one_time',
                    orderId: 'order-123',
                },
            });
            expect(paymentIntentRepository.save).toHaveBeenCalled();
            expect(result.userId).toBe('user-123');
            expect(result.amount).toBe(2000);
        });

        it('should throw error when customer not found', async () => {
            customerRepository.findByUserId.mockResolvedValue(null);

            await expect(handler.execute({ ...command, userId: 'user-123' })).rejects.toThrow(
                'Customer not found',
            );

            expect(stripeService.createPaymentIntent).not.toHaveBeenCalled();
            expect(paymentIntentRepository.save).not.toHaveBeenCalled();
        });

        it('should handle Stripe errors', async () => {
            customerRepository.findByUserId.mockResolvedValue(customer);
            stripeService.createPaymentIntent.mockRejectedValue(new Error('Stripe API error'));

            await expect(handler.execute({ ...command, userId: 'user-123' })).rejects.toThrow(
                'Stripe API error',
            );

            expect(paymentIntentRepository.save).not.toHaveBeenCalled();
        });

        it('should create payment without metadata', async () => {
            const commandWithoutMetadata = new CreatePaymentIntentCommand({
                amount: 2000,
                currency: CurrencyEnum.USD,
                paymentType: 'one_time' as any,
            });

            const stripePaymentIntent = {
                id: 'pi_test_123',
                object: 'payment_intent',
                amount: 2000,
                currency: 'usd',
                status: 'requires_payment_method',
            } as Stripe.PaymentIntent;

            customerRepository.findByUserId.mockResolvedValue(customer);
            stripeService.createPaymentIntent.mockResolvedValue(stripePaymentIntent);
            paymentIntentRepository.save.mockImplementation((payment) => Promise.resolve(payment));

            const result = await handler.execute({ ...commandWithoutMetadata, userId: 'user-123' });

            expect(result).toBeDefined();
            expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
                expect.objectContaining({
                    metadata: expect.objectContaining({
                        userId: 'user-123',
                        paymentType: 'one_time',
                    }),
                }),
            );
        });
    });
});
