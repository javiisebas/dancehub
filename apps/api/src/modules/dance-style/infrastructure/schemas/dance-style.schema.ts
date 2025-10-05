import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const danceStyles = pgTable('dance_styles', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type DanceStyleSchema = typeof danceStyles.$inferSelect;
export type NewDanceStyleSchema = typeof danceStyles.$inferInsert;
