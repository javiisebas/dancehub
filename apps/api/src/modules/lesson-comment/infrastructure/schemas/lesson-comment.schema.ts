import {
    pgTable,
    timestamp,
    uuid,
    text,
    integer,
} from 'drizzle-orm/pg-core';
import { users } from '../../../user/infrastructure/schemas/user.schema';
import { lessons } from '../../../lesson/infrastructure/schemas/lesson.schema';

export const lessonComments = pgTable('lesson_comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').notNull(),
    timestamp: integer('timestamp'),
    parentId: uuid('parent_id'),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
        .references(() => lessons.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type LessonCommentSchema = typeof lessonComments.$inferSelect;
