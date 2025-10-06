import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionRequest {
    @IsString()
    @IsNotEmpty()
    priceId!: string;

    @IsString()
    @IsOptional()
    couponId?: string;

    @IsOptional()
    metadata?: Record<string, any>;
}
