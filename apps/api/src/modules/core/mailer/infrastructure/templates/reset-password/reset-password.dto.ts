import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordTemplateDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    resetUrl: string;
}
