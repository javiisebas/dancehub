import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import { PaymentStatusEnum } from '@repo/shared';
import type { PaymentIntent } from '../entities/payment-intent.entity';

export const PAYMENT_INTENT_REPOSITORY = Symbol('PAYMENT_INTENT_REPOSITORY');

export interface IPaymentIntentRepository extends IBaseRepository<PaymentIntent, string> {
    findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<PaymentIntent | null>;
    findByUserId(userId: string): Promise<PaymentIntent[]>;
    findByStatus(status: PaymentStatusEnum): Promise<PaymentIntent[]>;
}
