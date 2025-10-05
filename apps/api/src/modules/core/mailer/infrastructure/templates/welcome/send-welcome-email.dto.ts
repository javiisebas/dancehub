import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { EmailTemplateEnum } from '../../../domain/enums/email-templates.enum';
import { SendEmailBaseDto } from '../../dtos/send-email-base.dto';
import { WelcomeTemplateDto } from './welcome.dto';

export class SendWelcomeEmailDto extends SendEmailBaseDto {
    @IsEnum(EmailTemplateEnum)
    template: EmailTemplateEnum.WELCOME;

    @ValidateNested()
    @Type(() => WelcomeTemplateDto)
    data: WelcomeTemplateDto;
}
