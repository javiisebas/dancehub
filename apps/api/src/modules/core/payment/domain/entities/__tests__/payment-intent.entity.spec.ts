import { CurrencyEnum } from '@repo/shared';
import { PaymentIntent } from '../payment-intent.entity';

describe('PaymentIntent Entity', () => {
    describe('create', () => {
        it('should create payment intent with valid data', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
                'Test payment',
            );

            expect(paymentIntent).toBeInstanceOf(PaymentIntent);
            expect(paymentIntent.userId).toBe('user-123');
            expect(paymentIntent.stripePaymentIntentId).toBe('pi_test_123');
            expect(paymentIntent.amount).toBe(2000);
            expect(paymentIntent.currency).toBe(CurrencyEnum.USD);
            expect(paymentIntent.status).toBe('pending');
            expect(paymentIntent.description).toBe('Test payment');
        });

        it('should create payment intent without description', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            expect(paymentIntent.description).toBeNull();
        });

        it('should create payment intent with metadata', () => {
            const metadata = { orderId: 'order-123', source: 'web' };
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
                'Test payment',
                metadata,
            );

            expect(paymentIntent.metadata).toEqual(metadata);
        });
    });

    describe('updateStatus', () => {
        it('should update payment status', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            expect(paymentIntent.status).toBe('pending');

            paymentIntent.updateStatus('succeeded' as any);

            expect(paymentIntent.status).toBe('succeeded');
        });
    });

    describe('status checks', () => {
        it('should check if payment succeeded', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            expect(paymentIntent.isSucceeded()).toBe(false);

            paymentIntent.updateStatus('succeeded' as any);

            expect(paymentIntent.isSucceeded()).toBe(true);
        });

        it('should check if payment failed', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            paymentIntent.updateStatus('failed' as any);

            expect(paymentIntent.isFailed()).toBe(true);
        });

        it('should check if payment is pending', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            expect(paymentIntent.isPending()).toBe(true);

            paymentIntent.updateStatus('succeeded' as any);

            expect(paymentIntent.isPending()).toBe(false);
        });
    });

    describe('canBeRefunded', () => {
        it('should allow refund for succeeded payment', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            paymentIntent.updateStatus('succeeded' as any);

            expect(paymentIntent.canBeRefunded()).toBe(true);
        });

        it('should not allow refund for pending payment', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            expect(paymentIntent.canBeRefunded()).toBe(false);
        });

        it('should not allow refund for failed payment', () => {
            const paymentIntent = PaymentIntent.create(
                'user-123',
                'pi_test_123',
                2000,
                CurrencyEnum.USD,
                'one_time' as any,
            );

            paymentIntent.updateStatus('failed' as any);

            expect(paymentIntent.canBeRefunded()).toBe(false);
        });
    });
});
