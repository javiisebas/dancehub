import { IsNotEmpty, IsString } from 'class-validator';

export class WelcomeTemplateDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
