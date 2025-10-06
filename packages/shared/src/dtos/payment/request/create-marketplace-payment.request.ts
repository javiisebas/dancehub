import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { CurrencyEnum } from '../../../enums/currency.enum';

export class CreateMarketplacePaymentRequest {
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    amount!: number;

    @IsEnum(CurrencyEnum)
    @IsNotEmpty()
    currency!: CurrencyEnum;

    @IsString()
    @IsNotEmpty()
    connectedAccountId!: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    platformFeePercentage?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    metadata?: Record<string, any>;
}
