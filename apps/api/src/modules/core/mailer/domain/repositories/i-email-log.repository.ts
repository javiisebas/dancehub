import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import { EmailLog } from '../entities/email-log.entity';

export const EMAIL_LOG_REPOSITORY = Symbol('EMAIL_LOG_REPOSITORY');

export interface IEmailLogRepository extends IBaseRepository<EmailLog> {
    findFailedOrStuckEmails(cooldownPeriod: number): Promise<EmailLog[]>;
}
