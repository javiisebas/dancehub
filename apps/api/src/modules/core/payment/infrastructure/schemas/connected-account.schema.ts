import { users } from '@api/modules/core/database/schema';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const connectedAccounts = pgTable('connected_accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' })
        .unique(),
    stripeAccountId: text('stripe_account_id').notNull().unique(),
    chargesEnabled: boolean('charges_enabled').notNull().default(false),
    payoutsEnabled: boolean('payouts_enabled').notNull().default(false),
    detailsSubmitted: boolean('details_submitted').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type ConnectedAccountSchema = typeof connectedAccounts.$inferSelect;
export type NewConnectedAccountSchema = typeof connectedAccounts.$inferInsert;
