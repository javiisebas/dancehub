import { boolean, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { lessons } from '../../../lesson/infrastructure/schemas/lesson.schema';
import { users } from '../../../user/infrastructure/schemas/user.schema';

export const courseProgresses = pgTable('course_progresses', {
    id: uuid('id').primaryKey().defaultRandom(),
    completed: boolean('completed').notNull().default(false),
    progressPercentage: integer('progress_percentage').notNull().default(0),
    lastWatchedAt: timestamp('last_watched_at'),
    watchTimeSeconds: integer('watch_time_seconds').notNull().default(0),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CourseProgressSchema = typeof courseProgresses.$inferSelect;
