import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailTemplateDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    verificationUrl: string;
}
