import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const artists = pgTable('artists', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ArtistSchema = typeof artists.$inferSelect;
