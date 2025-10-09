import { boolean, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { paymentTypeEnum } from '../../../core/payment/infrastructure/schemas/payment-intent.schema';
import { courses } from '../../../course/infrastructure/schemas/course.schema';
import { users } from '../../../user/infrastructure/schemas/user.schema';

export const enrollmentStatusEnum = pgEnum('enrollment_status', ['active', 'expired', 'canceled']);

export const enrollments = pgTable('enrollments', {
    id: uuid('id').primaryKey().defaultRandom(),
    enrolledAt: timestamp('enrolled_at').notNull(),
    expiresAt: timestamp('expires_at'),
    paymentId: varchar('payment_id', { length: 255 }),
    addedByArtist: boolean('added_by_artist').notNull().default(false),
    status: enrollmentStatusEnum('status').notNull().default('active'),
    paymentType: paymentTypeEnum('payment_type').notNull().default('one_time'),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type EnrollmentSchema = typeof enrollments.$inferSelect;
