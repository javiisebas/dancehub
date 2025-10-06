import { BaseEntity } from '@api/common/abstract/domain';
import { CurrencyEnum, PaymentStatusEnum, PaymentTypeEnum } from '@repo/shared';

export class PaymentIntent extends BaseEntity {
    constructor(
        id: string,
        public userId: string,
        public stripePaymentIntentId: string,
        public amount: number,
        public currency: CurrencyEnum,
        public status: PaymentStatusEnum,
        public paymentType: PaymentTypeEnum,
        public description: string | null,
        public metadata: Record<string, any> | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    updateStatus(status: PaymentStatusEnum): void {
        this.status = status;
    }

    isSucceeded(): boolean {
        return this.status === PaymentStatusEnum.SUCCEEDED;
    }

    isFailed(): boolean {
        return this.status === PaymentStatusEnum.FAILED;
    }

    isPending(): boolean {
        return this.status === PaymentStatusEnum.PENDING;
    }

    canBeRefunded(): boolean {
        return this.status === PaymentStatusEnum.SUCCEEDED;
    }

    static create(
        userId: string,
        stripePaymentIntentId: string,
        amount: number,
        currency: CurrencyEnum,
        paymentType: PaymentTypeEnum,
        description?: string,
        metadata?: Record<string, any>,
    ): PaymentIntent {
        const now = new Date();
        return new PaymentIntent(
            crypto.randomUUID(),
            userId,
            stripePaymentIntentId,
            amount,
            currency,
            PaymentStatusEnum.PENDING,
            paymentType,
            description ?? null,
            metadata ?? null,
            now,
            now,
        );
    }
}
