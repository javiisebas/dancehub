import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConnectedAccountRequest {
    @IsString()
    @IsNotEmpty()
    businessName!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    businessType?: 'individual' | 'company';
}
