import { pgEnum, pgTable, text, timestamp, uuid, varchar, integer, jsonb } from 'drizzle-orm/pg-core';
import { users } from '@api/modules/user/infrastructure/schemas/user.schema';

export const storageProviderEnum = pgEnum('storage_provider', ['r2', 's3', 'local']);
export const storageVisibilityEnum = pgEnum('storage_visibility', ['public', 'private', 'authenticated']);
export const storageStatusEnum = pgEnum('storage_status', ['uploading', 'active', 'failed', 'deleted']);

export const storages = pgTable('storages', {
    id: uuid('id').primaryKey().defaultRandom(),
    filename: varchar('filename', { length: 255 }).notNull(),
    originalName: varchar('original_name', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    extension: varchar('extension', { length: 10 }).notNull(),
    size: integer('size').notNull(),
    path: text('path').notNull(),
    provider: storageProviderEnum('provider').notNull().default('r2'),
    providerId: varchar('provider_id', { length: 255 }),
    visibility: storageVisibilityEnum('visibility').notNull().default('private'),
    status: storageStatusEnum('status').notNull().default('uploading'),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type StorageSchema = typeof storages.$inferSelect;
export type NewStorageSchema = typeof storages.$inferInsert;
