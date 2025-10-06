"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.venueDanceStyles = void 0;
var dance_style_schema_1 = require("@api/modules/dance-style/infrastructure/schemas/dance-style.schema");
var pg_core_1 = require("drizzle-orm/pg-core");
var venue_schema_1 = require("./venue.schema");
exports.venueDanceStyles = (0, pg_core_1.pgTable)('venue_dance_styles', {
    venueId: (0, pg_core_1.uuid)('venue_id')
        .notNull()
        .references(function () { return venue_schema_1.venues.id; }, { onDelete: 'cascade' }),
    danceStyleId: (0, pg_core_1.uuid)('dance_style_id')
        .notNull()
        .references(function () { return dance_style_schema_1.danceStyles.id; }, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, function (table) { return ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.venueId, table.danceStyleId] }),
}); });
