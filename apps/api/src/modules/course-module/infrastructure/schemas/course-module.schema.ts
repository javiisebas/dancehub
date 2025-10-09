import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { courses } from '../../../course/infrastructure/schemas/course.schema';

export const courseModules = pgTable('course_modules', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    order: integer('order').notNull().default(0),
    courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CourseModuleSchema = typeof courseModules.$inferSelect;
