import { CurrencyEnum } from '../../../enums/currency.enum';
import { PaymentStatusEnum } from '../../../enums/payment-status.enum';
import { PaymentTypeEnum } from '../../../enums/payment-type.enum';

export class PaymentIntentResponse {
    id!: string;
    userId!: string;
    amount!: number;
    currency!: CurrencyEnum;
    status!: PaymentStatusEnum;
    paymentType!: PaymentTypeEnum;
    stripePaymentIntentId!: string;
    clientSecret?: string;
    description?: string;
    metadata?: Record<string, any>;
    createdAt!: Date;
    updatedAt!: Date;
}
