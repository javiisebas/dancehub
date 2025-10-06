"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.danceStyles = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.danceStyles = (0, pg_core_1.pgTable)('dance_styles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
