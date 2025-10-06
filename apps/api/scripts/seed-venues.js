"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_postgres_1 = require("drizzle-orm/node-postgres");
var pg_1 = require("pg");
var user_schema_1 = require("../src/modules/user/infrastructure/schemas/user.schema");
var venue_schema_1 = require("../src/modules/venue/infrastructure/schemas/venue.schema");
var venue_dance_style_schema_1 = require("../src/modules/venue/infrastructure/schemas/venue-dance-style.schema");
var dance_style_schema_1 = require("../src/modules/dance-style/infrastructure/schemas/dance-style.schema");
var drizzle_orm_1 = require("drizzle-orm");
function seedVenues() {
    return __awaiter(this, void 0, void 0, function () {
        var pool, db, existingUsers, user, existingDanceStyles, existingVenue, venue1_1, insertedVenue, salsa, bachata, kizomba, existing, danceStylesToAdd, existingVenue2, venue2_1, insertedVenue2, existing, danceStylesToAdd, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pool = new pg_1.Pool({
                        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dancehub',
                    });
                    db = (0, node_postgres_1.drizzle)(pool);
                    console.log('🌱 Seeding venues...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 22, 23, 25]);
                    return [4 /*yield*/, db.select().from(user_schema_1.users).limit(1)];
                case 2:
                    existingUsers = _a.sent();
                    if (existingUsers.length === 0) {
                        console.error('❌ No users found. Please seed users first.');
                        return [2 /*return*/];
                    }
                    user = existingUsers[0];
                    console.log("\u2705 Found user: ".concat(user.email));
                    return [4 /*yield*/, db.select().from(dance_style_schema_1.danceStyles)];
                case 3:
                    existingDanceStyles = _a.sent();
                    if (existingDanceStyles.length === 0) {
                        console.error('❌ No dance styles found. Please seed dance styles first.');
                        return [2 /*return*/];
                    }
                    console.log("\u2705 Found ".concat(existingDanceStyles.length, " dance styles"));
                    return [4 /*yield*/, db.select().from(venue_schema_1.venues).where((0, drizzle_orm_1.eq)(venue_schema_1.venues.slug, 'el-salon-madrid')).limit(1)];
                case 4:
                    existingVenue = _a.sent();
                    if (!(existingVenue.length > 0)) return [3 /*break*/, 5];
                    console.log('⏭️  Venue "El Salón Madrid" already exists, skipping...');
                    venue1_1 = existingVenue[0];
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, db.insert(venue_schema_1.venues).values({
                        name: 'El Salón Madrid',
                        slug: 'el-salon-madrid',
                        address: 'Calle Gran Vía 25',
                        city: 'Madrid',
                        country: 'Spain',
                        capacity: 150,
                        hasParking: true,
                        ownerId: user.id,
                    }).returning()];
                case 6:
                    insertedVenue = (_a.sent())[0];
                    venue1_1 = insertedVenue;
                    console.log("\u2705 Created venue: ".concat(venue1_1.name));
                    _a.label = 7;
                case 7:
                    salsa = existingDanceStyles.find(function (ds) { return ds.slug === 'salsa'; });
                    bachata = existingDanceStyles.find(function (ds) { return ds.slug === 'bachata'; });
                    kizomba = existingDanceStyles.find(function (ds) { return ds.slug === 'kizomba'; });
                    if (!salsa) return [3 /*break*/, 12];
                    return [4 /*yield*/, db
                            .select()
                            .from(venue_dance_style_schema_1.venueDanceStyles)
                            .where((0, drizzle_orm_1.eq)(venue_dance_style_schema_1.venueDanceStyles.venueId, venue1_1.id))
                            .limit(1)];
                case 8:
                    existing = _a.sent();
                    if (!(existing.length === 0)) return [3 /*break*/, 11];
                    danceStylesToAdd = [salsa, bachata].filter(Boolean);
                    if (!(danceStylesToAdd.length > 0)) return [3 /*break*/, 10];
                    return [4 /*yield*/, db.insert(venue_dance_style_schema_1.venueDanceStyles).values(danceStylesToAdd.map(function (ds) { return ({
                            venueId: venue1_1.id,
                            danceStyleId: ds.id,
                        }); }))];
                case 9:
                    _a.sent();
                    console.log("\u2705 Added ".concat(danceStylesToAdd.length, " dance styles to ").concat(venue1_1.name));
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    console.log('⏭️  Dance styles already linked, skipping...');
                    _a.label = 12;
                case 12: return [4 /*yield*/, db.select().from(venue_schema_1.venues).where((0, drizzle_orm_1.eq)(venue_schema_1.venues.slug, 'barcelona-dance-club')).limit(1)];
                case 13:
                    existingVenue2 = _a.sent();
                    if (!(existingVenue2.length > 0)) return [3 /*break*/, 14];
                    console.log('⏭️  Venue "Barcelona Dance Club" already exists, skipping...');
                    venue2_1 = existingVenue2[0];
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, db.insert(venue_schema_1.venues).values({
                        name: 'Barcelona Dance Club',
                        slug: 'barcelona-dance-club',
                        address: 'Passeig de Gràcia 100',
                        city: 'Barcelona',
                        country: 'Spain',
                        capacity: 200,
                        hasParking: false,
                        ownerId: user.id,
                    }).returning()];
                case 15:
                    insertedVenue2 = (_a.sent())[0];
                    venue2_1 = insertedVenue2;
                    console.log("\u2705 Created venue: ".concat(venue2_1.name));
                    _a.label = 16;
                case 16:
                    if (!(bachata && kizomba)) return [3 /*break*/, 21];
                    return [4 /*yield*/, db
                            .select()
                            .from(venue_dance_style_schema_1.venueDanceStyles)
                            .where((0, drizzle_orm_1.eq)(venue_dance_style_schema_1.venueDanceStyles.venueId, venue2_1.id))
                            .limit(1)];
                case 17:
                    existing = _a.sent();
                    if (!(existing.length === 0)) return [3 /*break*/, 20];
                    danceStylesToAdd = [bachata, kizomba].filter(Boolean);
                    if (!(danceStylesToAdd.length > 0)) return [3 /*break*/, 19];
                    return [4 /*yield*/, db.insert(venue_dance_style_schema_1.venueDanceStyles).values(danceStylesToAdd.map(function (ds) { return ({
                            venueId: venue2_1.id,
                            danceStyleId: ds.id,
                        }); }))];
                case 18:
                    _a.sent();
                    console.log("\u2705 Added ".concat(danceStylesToAdd.length, " dance styles to ").concat(venue2_1.name));
                    _a.label = 19;
                case 19: return [3 /*break*/, 21];
                case 20:
                    console.log('⏭️  Dance styles already linked for Barcelona venue, skipping...');
                    _a.label = 21;
                case 21:
                    console.log('🎉 Venues seeded successfully!');
                    return [3 /*break*/, 25];
                case 22:
                    error_1 = _a.sent();
                    console.error('❌ Error seeding venues:', error_1);
                    throw error_1;
                case 23: return [4 /*yield*/, pool.end()];
                case 24:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 25: return [2 /*return*/];
            }
        });
    });
}
seedVenues();
