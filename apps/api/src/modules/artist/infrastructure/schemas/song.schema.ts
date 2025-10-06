import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { albums } from './album.schema';

export const songs = pgTable('songs', {
    id: uuid('id').primaryKey().defaultRandom(),
    albumId: uuid('album_id')
        .notNull()
        .references(() => albums.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    duration: integer('duration').notNull(),
    trackNumber: integer('track_number').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type SongSchema = typeof songs.$inferSelect;
