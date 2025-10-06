import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const artists = pgTable('artists', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    country: varchar('country', { length: 100 }).notNull(),
    bio: text('bio'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type ArtistSchema = typeof artists.$inferSelect;
