import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { danceStyles } from '../../../dance-style/infrastructure/schemas/dance-style.schema';
import { users } from './user.schema';

export const userDanceStyles = pgTable(
    'user_dance_styles',
    {
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        danceStyleId: uuid('dance_style_id')
            .notNull()
            .references(() => danceStyles.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.userId, table.danceStyleId] }),
    }),
);

export type UserDanceStyleSchema = typeof userDanceStyles.$inferSelect;
export type NewUserDanceStyleSchema = typeof userDanceStyles.$inferInsert;
