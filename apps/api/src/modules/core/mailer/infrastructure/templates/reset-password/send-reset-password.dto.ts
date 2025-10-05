import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { EmailTemplateEnum } from '../../../domain/enums/email-templates.enum';
import { SendEmailBaseDto } from '../../dtos/send-email-base.dto';
import { ResetPasswordTemplateDto } from './reset-password.dto';

export class SendResetPasswordEmailDto extends SendEmailBaseDto {
    @IsEnum(EmailTemplateEnum)
    template: EmailTemplateEnum.RESET_PASSWORD;

    @ValidateNested()
    @Type(() => ResetPasswordTemplateDto)
    data: ResetPasswordTemplateDto;
}
