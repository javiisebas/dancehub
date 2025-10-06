import { BaseRepository } from '@api/modules/core/database/base/base.repository';
import { Injectable } from '@nestjs/common';
import { and, lt, or, SQL, sql } from 'drizzle-orm';
import { EmailLog } from '../../domain/entities/email-log.entity';
import { EmailStatusEnum } from '../../domain/enums/email-status.enum';
import { IEmailLogRepository } from '../../domain/repositories/i-email-log.repository';
import { emailLogs } from '../schemas/email-log.schema';

type EmailLogField = 'to' | 'subject' | 'template' | 'status' | 'attempts' | 'error' | 'sentAt';

@Injectable()
export class EmailLogRepositoryImpl
    extends BaseRepository<EmailLog, typeof emailLogs, EmailLogField, {}>
    implements IEmailLogRepository
{
    protected table = emailLogs;
    protected entityName = 'EmailLog';

    protected toDomain(schema: typeof emailLogs.$inferSelect): EmailLog {
        return new EmailLog(
            schema.id,
            schema.to,
            schema.subject,
            schema.template,
            schema.data,
            schema.status,
            schema.attempts,
            schema.error ?? null,
            schema.sentAt ?? null,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: EmailLog): any {
        return {
            to: entity.to,
            subject: entity.subject,
            template: entity.template,
            data: entity.data,
            status: entity.status,
            attempts: entity.attempts,
            ...(entity.error && { error: entity.error }),
            ...(entity.sentAt && { sentAt: entity.sentAt }),
        };
    }

    async findFailedOrStuckEmails(cooldownPeriod: number): Promise<EmailLog[]> {
        const cooldownDate = new Date(Date.now() - cooldownPeriod);

        const condition: SQL = or(
            and(
                or(
                    sql`${this.table.status} = ${EmailStatusEnum.FAILED}`,
                    sql`${this.table.status} = ${EmailStatusEnum.RATE_LIMITED}`,
                ),
                lt(this.table.updatedAt, cooldownDate),
            ),
            and(
                sql`${this.table.status} = ${EmailStatusEnum.PENDING}`,
                lt(this.table.createdAt, cooldownDate),
            ),
        )!;

        const results = await this.db.select().from(this.table).where(condition).execute();

        return results.map((schema) => this.toDomain(schema));
    }
}
