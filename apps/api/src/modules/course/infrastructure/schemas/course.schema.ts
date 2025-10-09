import { relations } from 'drizzle-orm';
import { index, integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { danceStyles } from '../../../dance-style/infrastructure/schemas/dance-style.schema';
import { users } from '../../../user/infrastructure/schemas/user.schema';

export const courses = pgTable(
    'courses',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        slug: varchar('slug', { length: 255 }).notNull().unique(),
        level: varchar('level', { length: 50 }).notNull().default('beginner'),
        duration: integer('duration').notNull(),
        price: numeric('price', { precision: 10, scale: 2 }).notNull(),
        instructorId: uuid('instructor_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        danceStyleId: uuid('dance_style_id')
            .notNull()
            .references(() => danceStyles.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => ({
        courseLevelIdxIdx: index('course_level_idx').on(table.level),
        courseInstructorIdxIdx: index('course_instructor_idx').on(table.instructorId),
    }),
);

export type CourseSchema = typeof courses.$inferSelect;
export type NewCourseSchema = typeof courses.$inferInsert;

export const coursesRelations = relations(courses, ({ one, many }) => ({
    instructor: one(users, {
        fields: [courses.instructorId],
        references: [users.id],
    }),
    danceStyle: one(danceStyles, {
        fields: [courses.danceStyleId],
        references: [danceStyles.id],
    }),
}));
