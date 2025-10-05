import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { EmailTemplateEnum } from '../../../domain/enums/email-templates.enum';
import { SendEmailBaseDto } from '../../dtos/send-email-base.dto';
import { VerifyEmailTemplateDto } from './verify-email.dto';

export class SendVerifyEmailDto extends SendEmailBaseDto {
    @IsEnum(EmailTemplateEnum)
    template: EmailTemplateEnum.VERIFY_EMAIL;

    @ValidateNested()
    @Type(() => VerifyEmailTemplateDto)
    data: VerifyEmailTemplateDto;
}
