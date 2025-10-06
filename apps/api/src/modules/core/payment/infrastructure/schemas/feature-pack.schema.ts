import {
    boolean,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

export const featurePacks = pgTable('feature_packs', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    stripePriceId: text('stripe_price_id').notNull().unique(),
    stripeProductId: text('stripe_product_id').notNull(),
    amount: integer('amount').notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    features: jsonb('features').notNull().$type<string[]>(),
    isActive: boolean('is_active').notNull().default(true),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type FeaturePackSchema = typeof featurePacks.$inferSelect;
export type NewFeaturePackSchema = typeof featurePacks.$inferInsert;
