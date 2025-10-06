"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.userStatusEnum = exports.providerEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.providerEnum = (0, pg_core_1.pgEnum)('provider', ['local', 'google', 'facebook', 'apple']);
exports.userStatusEnum = (0, pg_core_1.pgEnum)('user_status', ['pending', 'verified', 'suspended']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    password: (0, pg_core_1.text)('password'),
    refreshToken: (0, pg_core_1.text)('refresh_token'),
    status: (0, exports.userStatusEnum)('status').notNull().default('pending'),
    provider: (0, exports.providerEnum)('provider').notNull().default('local'),
    providerId: (0, pg_core_1.varchar)('provider_id', { length: 255 }),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 255 }),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 255 }),
    displayName: (0, pg_core_1.varchar)('display_name', { length: 255 }),
    image: (0, pg_core_1.text)('image'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
