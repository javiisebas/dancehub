import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { storages } from './storage.schema';

export const thumbnailSizeEnum = pgEnum('thumbnail_size', ['small', 'medium', 'large']);

export const storageThumbnails = pgTable('storage_thumbnails', {
    id: uuid('id').primaryKey().defaultRandom(),
    storageId: uuid('storage_id')
        .notNull()
        .references(() => storages.id, { onDelete: 'cascade' }),
    size: thumbnailSizeEnum('size').notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    path: text('path').notNull(),
    fileSize: integer('file_size').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type StorageThumbnailSchema = typeof storageThumbnails.$inferSelect;
export type NewStorageThumbnailSchema = typeof storageThumbnails.$inferInsert;
