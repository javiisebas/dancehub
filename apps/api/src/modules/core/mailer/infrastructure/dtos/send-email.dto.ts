import { SendResetPasswordEmailDto } from '../templates/reset-password/send-reset-password.dto';
import { SendVerifyEmailDto } from '../templates/verify-email/send-verify-email.dto';
import { SendWelcomeEmailDto } from '../templates/welcome/send-welcome-email.dto';

export type SendEmailDto = SendWelcomeEmailDto | SendResetPasswordEmailDto | SendVerifyEmailDto;
