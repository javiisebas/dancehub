import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { PaymentStatusEnum } from '@repo/shared';
import { eq } from 'drizzle-orm';
import { PaymentIntent } from '../../domain/entities/payment-intent.entity';
import { IPaymentIntentRepository } from '../../domain/repositories/i-payment-intent.repository';
import { paymentIntents } from '../schemas/payment-intent.schema';

@Injectable()
export class PaymentIntentRepositoryImpl
    extends BaseRepository<PaymentIntent, typeof paymentIntents>
    implements IPaymentIntentRepository
{
    protected readonly table = paymentIntents;
    protected readonly entityName = 'PaymentIntent';

    protected toDomain(schema: typeof paymentIntents.$inferSelect): PaymentIntent {
        return new PaymentIntent(
            schema.id,
            schema.userId,
            schema.stripePaymentIntentId,
            schema.amount,
            schema.currency as any,
            schema.status as any,
            schema.paymentType as any,
            schema.description ?? null,
            (schema.metadata as any) ?? null,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: PaymentIntent): any {
        return {
            userId: entity.userId,
            stripePaymentIntentId: entity.stripePaymentIntentId,
            amount: entity.amount,
            currency: entity.currency,
            status: entity.status,
            paymentType: entity.paymentType,
            ...(entity.description && { description: entity.description }),
            ...(entity.metadata && { metadata: entity.metadata }),
        };
    }

    async findByStripePaymentIntentId(
        stripePaymentIntentId: string,
    ): Promise<PaymentIntent | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.stripePaymentIntentId, stripePaymentIntentId))
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }

    async findByUserId(userId: string): Promise<PaymentIntent[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.userId, userId));
        return results.map((r) => this.toDomain(r));
    }

    async findByStatus(status: PaymentStatusEnum): Promise<PaymentIntent[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.status, status));
        return results.map((r) => this.toDomain(r));
    }
}
