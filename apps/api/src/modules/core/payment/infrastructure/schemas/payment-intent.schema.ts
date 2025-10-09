import { users } from '@api/modules/core/database/schema';
import {
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

export const paymentStatusEnum = pgEnum('payment_status', [
    'pending',
    'processing',
    'succeeded',
    'failed',
    'canceled',
    'refunded',
    'partially_refunded',
]);

export const paymentTypeEnum = pgEnum('payment_type', [
    'one_time',
    'subscription',
    'marketplace',
    'feature_pack',
]);

export const paymentIntents = pgTable('payment_intents', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    stripePaymentIntentId: text('stripe_payment_intent_id').notNull().unique(),
    amount: integer('amount').notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    status: paymentStatusEnum('status').notNull().default('pending'),
    paymentType: paymentTypeEnum('payment_type').notNull().default('one_time'),
    description: text('description'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type PaymentIntentSchema = typeof paymentIntents.$inferSelect;
export type NewPaymentIntentSchema = typeof paymentIntents.$inferInsert;
