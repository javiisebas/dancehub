import { users } from '@api/modules/core/database/schema';
import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

export const subscriptionStatusEnum = pgEnum('subscription_status', [
    'active',
    'past_due',
    'unpaid',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'paused',
]);

export const subscriptionIntervalEnum = pgEnum('subscription_interval', [
    'day',
    'week',
    'month',
    'year',
]);

export const subscriptions = pgTable('subscriptions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
    stripePriceId: text('stripe_price_id').notNull(),
    stripeProductId: text('stripe_product_id').notNull(),
    status: subscriptionStatusEnum('status').notNull().default('incomplete'),
    currentPeriodStart: timestamp('current_period_start').notNull(),
    currentPeriodEnd: timestamp('current_period_end').notNull(),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
    interval: subscriptionIntervalEnum('interval').notNull(),
    intervalCount: integer('interval_count').notNull().default(1),
    amount: integer('amount').notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    trialEnd: timestamp('trial_end'),
    canceledAt: timestamp('canceled_at'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type SubscriptionSchema = typeof subscriptions.$inferSelect;
export type NewSubscriptionSchema = typeof subscriptions.$inferInsert;
