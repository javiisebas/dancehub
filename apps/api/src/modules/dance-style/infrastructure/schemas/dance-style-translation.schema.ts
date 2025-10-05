import { pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { danceStyles } from './dance-style.schema';

export const danceStyleTranslations = pgTable(
    'dance_style_translations',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        danceStyleId: uuid('dance_style_id')
            .notNull()
            .references(() => danceStyles.id, { onDelete: 'cascade' }),
        locale: varchar('locale', { length: 10 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => ({
        uniqueDanceStyleLocale: unique().on(table.danceStyleId, table.locale),
    }),
);

export type DanceStyleTranslationSchema = typeof danceStyleTranslations.$inferSelect;
export type NewDanceStyleTranslationSchema = typeof danceStyleTranslations.$inferInsert;
