import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PurchaseFeaturePackRequest {
    @IsString()
    @IsNotEmpty()
    featurePackId!: string;

    @IsArray()
    @IsNotEmpty()
    features!: string[];
}
