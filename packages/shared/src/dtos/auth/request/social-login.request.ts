import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProvidersEnum } from '../../../enums/providers.enum';

export class SocialLoginRequest {
    @IsEnum(ProvidersEnum)
    @IsNotEmpty()
    provider!: ProvidersEnum;

    @IsString()
    @IsNotEmpty()
    providerId!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    displayName?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsBoolean()
    @IsOptional()
    verified?: boolean;
}
