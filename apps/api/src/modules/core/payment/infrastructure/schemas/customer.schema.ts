import { users } from '@api/modules/core/database/schema';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' })
        .unique(),
    stripeCustomerId: text('stripe_customer_id').notNull().unique(),
    email: text('email').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CustomerSchema = typeof customers.$inferSelect;
export type NewCustomerSchema = typeof customers.$inferInsert;
