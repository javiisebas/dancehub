import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { courseModules } from '../../../course-module/infrastructure/schemas/course-module.schema';

export const lessons = pgTable('lessons', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    content: text('content'),
    videoUrl: text('video_url'),
    duration: integer('duration'),
    order: integer('order').notNull().default(0),
    moduleId: uuid('module_id').references(() => courseModules.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type LessonSchema = typeof lessons.$inferSelect;
