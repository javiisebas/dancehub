import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    text,
    integer,
} from 'drizzle-orm/pg-core';
import { lessons } from '../../../lesson/infrastructure/schemas/lesson.schema';

export const lessonAttachments = pgTable('lesson_attachments', {
    id: uuid('id').primaryKey().defaultRandom(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileUrl: text('file_url').notNull(),
    fileType: varchar('file_type', { length: 50 }).notNull(),
    fileSize: integer('file_size'),
    lessonId: uuid('lesson_id')
        .references(() => lessons.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type LessonAttachmentSchema = typeof lessonAttachments.$inferSelect;
