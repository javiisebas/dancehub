import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider', ['local', 'google', 'facebook', 'apple']);
export const userStatusEnum = pgEnum('user_status', ['pending', 'verified', 'suspended']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    password: text('password'),
    refreshToken: text('refresh_token'),
    status: userStatusEnum('status').notNull().default('pending'),
    provider: providerEnum('provider').notNull().default('local'),
    providerId: varchar('provider_id', { length: 255 }),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    displayName: varchar('display_name', { length: 255 }),
    image: text('image'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type UserSchema = typeof users.$inferSelect;
export type NewUserSchema = typeof users.$inferInsert;
