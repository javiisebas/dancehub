import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { albums } from './album.schema';
import { artists } from './artist.schema';

export const songs = pgTable('songs', {
    id: uuid('id').defaultRandom().primaryKey(),
    albumId: uuid('album_id')
        .notNull()
        .references(() => albums.id, { onDelete: 'cascade' }),
    artistId: uuid('artist_id')
        .notNull()
        .references(() => artists.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 256 }).notNull(),
    duration: integer('duration').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SongSchema = typeof songs.$inferSelect;
