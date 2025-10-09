import { boolean, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const webhookEvents = pgTable('webhook_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    stripeEventId: text('stripe_event_id').notNull().unique(),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    data: jsonb('data').notNull(),
    processed: boolean('processed').notNull().default(false),
    processedAt: timestamp('processed_at'),
    error: text('error'),
    retryCount: varchar('retry_count', { length: 255 }).notNull().default('0'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type WebhookEventSchema = typeof webhookEvents.$inferSelect;
export type NewWebhookEventSchema = typeof webhookEvents.$inferInsert;
