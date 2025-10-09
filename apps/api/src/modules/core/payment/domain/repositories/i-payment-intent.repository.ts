import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { PaymentStatusEnum } from '@repo/shared';
import { paymentIntents } from '../../infrastructure/schemas/payment-intent.schema';
import type { PaymentIntent } from '../entities/payment-intent.entity';

export const PAYMENT_INTENT_REPOSITORY = Symbol('PAYMENT_INTENT_REPOSITORY');

export type PaymentIntentField = InferFields<typeof paymentIntents>;
export type PaymentIntentRelations = {};

export interface IPaymentIntentRepository
    extends IBaseRepository<PaymentIntent, PaymentIntentField, PaymentIntentRelations> {
    findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<PaymentIntent | null>;
    findByUserId(userId: string): Promise<PaymentIntent[]>;
    findByStatus(status: PaymentStatusEnum): Promise<PaymentIntent[]>;
}
