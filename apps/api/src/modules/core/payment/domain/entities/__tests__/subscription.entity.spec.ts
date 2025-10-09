import { CurrencyEnum } from '@repo/shared';
import { Subscription } from '../subscription.entity';

describe('Subscription Entity', () => {
    const now = new Date();
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    describe('create', () => {
        it('should create subscription with valid data', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            expect(subscription).toBeInstanceOf(Subscription);
            expect(subscription.userId).toBe('user-123');
            expect(subscription.stripeSubscriptionId).toBe('sub_test_123');
            expect(subscription.status).toBe('incomplete');
            expect(subscription.cancelAtPeriodEnd).toBe(false);
            expect(subscription.amount).toBe(2999);
        });

        it('should create subscription with trial', () => {
            const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
                trialEnd,
            );

            expect(subscription.trialEnd).toEqual(trialEnd);
        });

        it('should create subscription with metadata', () => {
            const metadata = { plan: 'premium', source: 'web' };
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
                undefined,
                metadata,
            );

            expect(subscription.metadata).toEqual(metadata);
        });
    });

    describe('updateStatus', () => {
        it('should update subscription status', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            subscription.updateStatus('active' as any);

            expect(subscription.status).toBe('active');
        });
    });

    describe('cancel', () => {
        it('should cancel at period end by default', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            subscription.cancel();

            expect(subscription.cancelAtPeriodEnd).toBe(true);
            expect(subscription.status).toBe('incomplete');
            expect(subscription.canceledAt).toBeNull();
        });

        it('should cancel immediately when specified', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            subscription.cancel(false);

            expect(subscription.status).toBe('canceled');
            expect(subscription.canceledAt).toBeInstanceOf(Date);
        });
    });

    describe('status checks', () => {
        it('should check if subscription is active', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            expect(subscription.isActive()).toBe(false);

            subscription.updateStatus('active' as any);

            expect(subscription.isActive()).toBe(true);
        });

        it('should check if subscription is canceled', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            subscription.updateStatus('canceled' as any);

            expect(subscription.isCanceled()).toBe(true);
        });

        it('should check if subscription is trialing', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            subscription.updateStatus('trialing' as any);

            expect(subscription.isTrialing()).toBe(true);
        });

        it('should check if will cancel at period end', () => {
            const subscription = Subscription.create(
                'user-123',
                'sub_test_123',
                'price_test_123',
                'prod_test_123',
                now,
                oneMonthLater,
                'month' as any,
                1,
                2999,
                CurrencyEnum.USD,
            );

            expect(subscription.willCancelAtPeriodEnd()).toBe(false);

            subscription.cancel(true);

            expect(subscription.willCancelAtPeriodEnd()).toBe(true);
        });
    });
});
