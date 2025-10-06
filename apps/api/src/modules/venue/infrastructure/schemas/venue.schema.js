"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.venues = void 0;
var user_schema_1 = require("@api/modules/user/infrastructure/schemas/user.schema");
var pg_core_1 = require("drizzle-orm/pg-core");
exports.venues = (0, pg_core_1.pgTable)('venues', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    address: (0, pg_core_1.text)('address').notNull(),
    city: (0, pg_core_1.varchar)('city', { length: 100 }).notNull(),
    country: (0, pg_core_1.varchar)('country', { length: 100 }).notNull(),
    capacity: (0, pg_core_1.integer)('capacity'),
    hasParking: (0, pg_core_1.boolean)('has_parking').default(false),
    ownerId: (0, pg_core_1.uuid)('owner_id')
        .notNull()
        .references(function () { return user_schema_1.users.id; }, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
