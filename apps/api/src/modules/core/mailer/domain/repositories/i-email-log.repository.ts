import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { EmailLog } from '../entities/email-log.entity';

export const EMAIL_LOG_REPOSITORY = Symbol('EMAIL_LOG_REPOSITORY');

export interface IEmailLogRepository extends IBaseRepository<EmailLog> {
    findFailedOrStuckEmails(cooldownPeriod: number): Promise<EmailLog[]>;
}
