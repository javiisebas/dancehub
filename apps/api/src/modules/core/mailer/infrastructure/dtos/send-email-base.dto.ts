import { IsEmail, IsNotEmpty } from 'class-validator';

export abstract class SendEmailBaseDto {
    @IsEmail()
    to: string;

    @IsNotEmpty()
    subject: string;
}
