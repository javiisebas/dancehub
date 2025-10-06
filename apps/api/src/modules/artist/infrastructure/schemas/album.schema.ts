import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { artists } from './artist.schema';

export const albums = pgTable('albums', {
    id: uuid('id').primaryKey().defaultRandom(),
    artistId: uuid('artist_id')
        .notNull()
        .references(() => artists.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    releaseYear: integer('release_year').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type AlbumSchema = typeof albums.$inferSelect;
