import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { PaymentTypeEnum } from '../../../enums/payment-type.enum';

export class CreateCheckoutSessionRequest {
    @IsArray()
    @IsNotEmpty()
    lineItems!: Array<{
        priceId?: string;
        amount?: number;
        currency?: string;
        quantity: number;
        name?: string;
        description?: string;
    }>;

    @IsEnum(PaymentTypeEnum)
    @IsNotEmpty()
    mode!: PaymentTypeEnum;

    @IsUrl()
    @IsNotEmpty()
    successUrl!: string;

    @IsUrl()
    @IsNotEmpty()
    cancelUrl!: string;

    @IsString()
    @IsOptional()
    customerId?: string;

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
}
