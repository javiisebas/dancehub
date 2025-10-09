import {
    pgTable,
    timestamp,
    uuid,
    index,
    uniqueIndex,
    varchar,
    text,
    integer,
    numeric,
    boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../../../user/infrastructure/schemas/user.schema';
import { danceStyles } from '../../../dance-style/infrastructure/schemas/dance-style.schema';

export const events = pgTable('events', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    category: varchar('category', { length: 50 }).notNull(),
    maxAttendees: integer('max_attendees'),
    price: numeric('price', { precision: 10, scale: 2 }),
    isFeatured: boolean('is_featured').notNull().default(false),
    organizerId: uuid('organizer_id')
        .references(() => users.id, { onDelete: 'cascade' }),
    danceStyleId: uuid('dance_style_id')
        .references(() => danceStyles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
    eventSlugIdxIdx: uniqueIndex('event_slug_idx').on(table.slug),
    eventStatusDateIdxIdx: index('event_status_date_idx').on(table.status, table.startDate),
    eventOrganizerIdxIdx: index('event_organizer_idx').on(table.organizerId),
}));

export type EventSchema = typeof events.$inferSelect;

export const eventsRelations = relations(events, ({ one, many }) => ({
    organizer: one(users, {
        fields: [events.organizerId],
        references: [users.id],
    }),
    danceStyle: one(danceStyles, {
        fields: [events.danceStyleId],
        references: [danceStyles.id],
    }),
}));
