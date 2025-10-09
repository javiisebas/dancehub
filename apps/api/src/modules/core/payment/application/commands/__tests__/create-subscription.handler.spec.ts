import { Test, TestingModule } from '@nestjs/testing';
import { CreateSubscriptionHandler } from '../create-subscription.handler';
import { ISubscriptionRepository, SUBSCRIPTION_REPOSITORY } from '../../../domain/repositories/i-subscription.repository';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../../../domain/repositories/i-customer.repository';
import { StripeService } from '../../../domain/services/stripe.service';
import { Customer } from '../../../domain/entities/customer.entity';

describe('CreateSubscriptionHandler', () => {
    let handler: CreateSubscriptionHandler;
    let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
    let customerRepository: jest.Mocked<ICustomerRepository>;
    let stripeService: jest.Mocked<StripeService>;

    const mockCustomer = Customer.create('user-id', 'cus_123', 'test@example.com', 'Test User');

    beforeEach(async () => {
        const mockSubscriptionRepo = {
            create: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            findByStripeSubscriptionId: jest.fn(),
            findActiveByUserId: jest.fn(),
            findByStatus: jest.fn(),
            findAll: jest.fn(),
        };

        const mockCustomerRepo = {
            create: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn().mockResolvedValue(mockCustomer),
            findByStripeCustomerId: jest.fn(),
            findAll: jest.fn(),
        };

        const mockStripeService = {
            createSubscription: jest.fn(),
            getClient: jest.fn().mockReturnValue({
                prices: {
                    retrieve: jest.fn().mockResolvedValue({
                        unit_amount: 1000,
                        currency: 'usd',
                        recurring: {
                            interval: 'month',
                            interval_count: 1,
                        },
                    }),
                },
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateSubscriptionHandler,
                {
                    provide: SUBSCRIPTION_REPOSITORY,
                    useValue: mockSubscriptionRepo,
                },
                {
                    provide: CUSTOMER_REPOSITORY,
                    useValue: mockCustomerRepo,
                },
                {
                    provide: StripeService,
                    useValue: mockStripeService,
                },
            ],
        }).compile();

        handler = module.get<CreateSubscriptionHandler>(CreateSubscriptionHandler);
        subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY);
        customerRepository = module.get(CUSTOMER_REPOSITORY);
        stripeService = module.get(StripeService);
    });

    it('should create a subscription', async () => {
        const mockStripeSubscription = {
            id: 'sub_123',
            items: {
                data: [
                    {
                        price: {
                            product: 'prod_123',
                        },
                    },
                ],
            },
            current_period_start: Date.now() / 1000,
            current_period_end: (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000,
            cancel_at_period_end: false,
            trial_end: null,
        };

        stripeService.createSubscription.mockResolvedValue(mockStripeSubscription as any);
        subscriptionRepository.create.mockResolvedValue({} as any);

        const result = await handler.execute({
            data: {
                priceId: 'price_123',
            },
            userId: 'user-id',
        });

        expect(customerRepository.findByUserId).toHaveBeenCalledWith('user-id');
        expect(stripeService.createSubscription).toHaveBeenCalled();
        expect(subscriptionRepository.create).toHaveBeenCalled();
    });

    it('should throw error if customer not found', async () => {
        customerRepository.findByUserId.mockResolvedValue(null);

        await expect(
            handler.execute({
                data: {
                    priceId: 'price_123',
                },
                userId: 'user-id',
            }),
        ).rejects.toThrow('Customer not found');
    });
});

