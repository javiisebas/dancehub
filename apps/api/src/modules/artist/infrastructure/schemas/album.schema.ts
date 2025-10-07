import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { artists } from './artist.schema';

export const albums = pgTable('albums', {
    id: uuid('id').defaultRandom().primaryKey(),
    artistId: uuid('artist_id')
        .notNull()
        .references(() => artists.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 256 }).notNull(),
    releaseYear: integer('release_year').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type AlbumSchema = typeof albums.$inferSelect;
