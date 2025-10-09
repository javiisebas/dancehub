import { users } from '@api/modules/core/database/schema';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { featurePacks } from './feature-pack.schema';

export const userFeatures = pgTable('user_features', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    featurePackId: uuid('feature_pack_id')
        .notNull()
        .references(() => featurePacks.id, { onDelete: 'cascade' }),
    featureName: varchar('feature_name', { length: 255 }).notNull(),
    isEnabled: varchar('is_enabled', { length: 255 }).notNull().default('true'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type UserFeatureSchema = typeof userFeatures.$inferSelect;
export type NewUserFeatureSchema = typeof userFeatures.$inferInsert;
