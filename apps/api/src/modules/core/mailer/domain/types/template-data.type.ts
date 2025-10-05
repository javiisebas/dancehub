import { ResetPasswordTemplateDto } from '../../infrastructure/templates/reset-password/reset-password.dto';
import { VerifyEmailTemplateDto } from '../../infrastructure/templates/verify-email/verify-email.dto';
import { WelcomeTemplateDto } from '../../infrastructure/templates/welcome/welcome.dto';
import { EmailTemplateEnum } from '../enums/email-templates.enum';

export interface TemplateDataMap {
    [EmailTemplateEnum.WELCOME]: WelcomeTemplateDto;
    [EmailTemplateEnum.RESET_PASSWORD]: ResetPasswordTemplateDto;
    [EmailTemplateEnum.VERIFY_EMAIL]: VerifyEmailTemplateDto;
}
