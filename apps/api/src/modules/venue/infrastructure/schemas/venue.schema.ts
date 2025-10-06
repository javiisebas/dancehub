import { users } from '@api/modules/user/infrastructure/schemas/user.schema';
import { pgTable, text, timestamp, uuid, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const venues = pgTable('venues', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    address: text('address').notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    country: varchar('country', { length: 100 }).notNull(),
    capacity: integer('capacity'),
    hasParking: boolean('has_parking').default(false),
    ownerId: uuid('owner_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type VenueSchema = typeof venues.$inferSelect;
export type NewVenueSchema = typeof venues.$inferInsert;

