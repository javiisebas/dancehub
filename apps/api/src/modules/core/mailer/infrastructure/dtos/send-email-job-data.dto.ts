import { SendEmailDto } from './send-email.dto';

export type SendEmailJobData = SendEmailDto & {
    emailLogId?: string;
};
