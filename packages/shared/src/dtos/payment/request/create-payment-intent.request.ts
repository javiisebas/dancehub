import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { CurrencyEnum } from '../../../enums/currency.enum';
import { PaymentTypeEnum } from '../../../enums/payment-type.enum';

export class CreatePaymentIntentRequest {
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    amount!: number;

    @IsEnum(CurrencyEnum)
    @IsNotEmpty()
    currency!: CurrencyEnum;

    @IsEnum(PaymentTypeEnum)
    @IsNotEmpty()
    paymentType!: PaymentTypeEnum;

    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
}
