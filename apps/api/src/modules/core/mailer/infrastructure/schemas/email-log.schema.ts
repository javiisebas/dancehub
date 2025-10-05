import {
    integer,
    json,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import { EmailStatusEnum } from '../../domain/enums/email-status.enum';
import { EmailTemplateEnum } from '../../domain/enums/email-templates.enum';

export const emailStatusEnumPg = pgEnum('email_status', [
    EmailStatusEnum.TO_BE_SENT,
    EmailStatusEnum.PENDING,
    EmailStatusEnum.SENT,
    EmailStatusEnum.FAILED,
    EmailStatusEnum.RATE_LIMITED,
]);

export const emailTemplateEnumPg = pgEnum('email_template', [
    EmailTemplateEnum.VERIFY_EMAIL,
    EmailTemplateEnum.RESET_PASSWORD,
    EmailTemplateEnum.WELCOME,
]);

export const emailLogs = pgTable('email_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    to: varchar('to', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 500 }).notNull(),
    template: emailTemplateEnumPg('template').notNull(),
    data: json('data'),
    status: emailStatusEnumPg('status').notNull().default(EmailStatusEnum.PENDING),
    attempts: integer('attempts').notNull().default(0),
    error: text('error'),
    sentAt: timestamp('sent_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type EmailLogSchema = typeof emailLogs.$inferSelect;
export type NewEmailLogSchema = typeof emailLogs.$inferInsert;
