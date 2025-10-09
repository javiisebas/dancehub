import { pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { courses } from './course.schema';

export const courseTranslations = pgTable(
    'course_translations',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        courseId: uuid('course_id')
            .notNull()
            .references(() => courses.id, { onDelete: 'cascade' }),
        locale: varchar('locale', { length: 10 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => ({
        uniqueCourseLocale: unique().on(table.courseId, table.locale),
    }),
);

export type CourseTranslationSchema = typeof courseTranslations.$inferSelect;
export type NewCourseTranslationSchema = typeof courseTranslations.$inferInsert;
