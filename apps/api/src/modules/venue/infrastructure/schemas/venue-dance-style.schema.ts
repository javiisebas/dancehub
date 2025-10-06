import { danceStyles } from '@api/modules/dance-style/infrastructure/schemas/dance-style.schema';
import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { venues } from './venue.schema';

export const venueDanceStyles = pgTable(
    'venue_dance_styles',
    {
        venueId: uuid('venue_id')
            .notNull()
            .references(() => venues.id, { onDelete: 'cascade' }),
        danceStyleId: uuid('dance_style_id')
            .notNull()
            .references(() => danceStyles.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.venueId, table.danceStyleId] }),
    }),
);

export type VenueDanceStyleSchema = typeof venueDanceStyles.$inferSelect;

